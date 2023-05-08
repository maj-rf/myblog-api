import { IBlog } from './../types/types';
import mongoose from 'mongoose';
import supertest from 'supertest';
import { User } from '../models/user';
import { Blog } from '../models/blog';
import { Comment } from '../models/comment';
import app from '../app';

const api = supertest(app);
let token = '';
let blogId = '';
let deleteBlogID = '';

describe('auth routes', () => {
  beforeAll(async () => {
    await User.deleteMany({});
  });

  test('user registration - success', async () => {
    const user = {
      username: 'newUser',
      email: 'newUser@gmail.com',
      password: 'newUser',
      confirm_pass: 'newUser',
    };
    await api
      .post('/api/auth/register')
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/);
  });

  test('user login - success', async () => {
    const validUser = { email: 'newUser@gmail.com', password: 'newUser' };
    const res = await api.post('/api/auth/login').send(validUser);
    token = res.body.accessToken;
    expect(res.body.accessToken).toBeDefined();
  });

  test('user login - missing email', async () => {
    const newUser = {
      email: '',
      password: 'newUser',
    };

    const response = await api.post('/api/auth/login').send(newUser);
    expect(response.statusCode).toBe(400);
  });

  test('user login - wrong password', async () => {
    const newUser = {
      email: 'newUser@gmail.com',
      password: 'wrongpass',
    };

    const response = await api.post('/api/auth/login').send(newUser);
    expect(response.statusCode).toBe(401);
  });
});

describe('blog routes', () => {
  beforeAll(async () => {
    await Blog.deleteMany({});
  });

  const baseBlog = '/api/blogs';
  test('get all blogs - unauthenticated user', async () => {
    await api.get(baseBlog).expect(401);
  });

  test('get all blogs - authenticated user', async () => {
    await api.get(baseBlog).set('Authorization', `Bearer ${token}`).expect(200);
  });

  test('create a blog', async () => {
    const blog = {
      title: 'A Random Title',
      content: 'Random Content',
    };
    await api
      .post('/api/blogs/')
      .set('Authorization', `Bearer ${token}`)
      .send(blog);
    expect(201);
    const res = await api.get(baseBlog).set('Authorization', `Bearer ${token}`);
    // set to blogId to use it on other tests
    blogId = res.body[0]._id;
    expect(res.body).toHaveLength(1);
  });

  test('blogs should have a unique identifier property id', async () => {
    const blog = {
      title: 'Second Random Title',
      content: 'Second Random Content',
    };

    const response = await api
      .post('/api/blogs')
      .send(blog)
      .set('Authorization', `Bearer ${token}`);
    deleteBlogID = response.body._id;
    for (const key of Object.keys(response.body)) {
      if (key === '_id') expect(key).toBeDefined();
    }
  });

  test('blog update - incomplete input', async () => {
    const update = {
      title: 'Updated Title',
    };
    await api
      .put(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(update)
      .expect(422);
  });

  test('blog update - success', async () => {
    const update = {
      title: 'Updated Title',
      content: 'Updated Content',
    };
    await api
      .put(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(update)
      .expect(202);
    const res = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`);
    const current = res.body.find((blog: IBlog) => blog._id === blogId);
    expect(current.title).toEqual('Updated Title');
  });
  test('delete blog', async () => {
    await api
      .delete(`/api/blogs/${deleteBlogID}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    const res = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`);
    expect(res.body).toHaveLength(1);
  });
});

describe('comment routes', () => {
  beforeAll(async () => {
    await Comment.deleteMany({});
  });
  test('create comment', async () => {
    const comment = {
      comment_content: 'A new comment',
    };
    await api
      .post(`/api/comments/${blogId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(comment)
      .expect(201);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
