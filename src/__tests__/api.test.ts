import { IBlog } from './../types/types';
import mongoose from 'mongoose';
import supertest from 'supertest';
import { User } from '../models/user';
import { Blog } from '../models/blog';
import { Comment } from '../models/comment';
import bcrypt from 'bcrypt';
import app from '../app';

const api = supertest(app);
let token = '';
let userID = '';
let blogID = '';

describe('auth routes', () => {
  beforeAll(async () => {
    await User.deleteMany({});
    const password = await bcrypt.hash('secret', 10);
    const user = new User({
      username: 'default',
      email: 'default@gmail.com',
      password,
    });
    await user.save();
    userID = user._id.toString();
  });

  const baseAuth = `/api/auth`;
  describe('POST /api/auth/register', () => {
    test('user registration - success', async () => {
      const user = {
        username: 'newUser',
        email: 'newUser@gmail.com',
        password: 'newUser',
        confirm_pass: 'newUser',
      };
      await api
        .post(`${baseAuth}/register`)
        .send(user)
        .expect(201)
        .expect('Content-Type', /application\/json/);
    });
  });

  describe('POST /api/auth/login', () => {
    test('user login - success', async () => {
      const validUser = { email: 'default@gmail.com', password: 'secret' };
      const res = await api.post(`${baseAuth}/login`).send(validUser);
      token = res.headers['set-cookie'];
      expect(res.headers['set-cookie']).toBeDefined();
    });

    test('user login - missing email', async () => {
      const newUser = {
        email: '',
        password: 'newUser',
      };

      await api.post(`${baseAuth}/login`).send(newUser).expect(400);
    });

    test('user login - wrong password', async () => {
      const newUser = {
        email: 'newUser@gmail.com',
        password: 'wrongpass',
      };

      await api.post(`${baseAuth}/login`).send(newUser).expect(401);
    });
  });
});

describe('blog routes', () => {
  beforeAll(async () => {
    await Blog.deleteMany({});
    const blog = new Blog({
      title: 'Blog by Default User',
      content: 'Random Content',
      user: userID,
      published: false,
      comments: [],
      tags: [],
    });
    await blog.save();
    blogID = blog._id.toString();
  });

  const baseBlog = '/api/blogs';

  describe('GET /api/blogs', () => {
    test('get all blogs', async () => {
      await api.get(`${baseBlog}/all`).set('Cookie', [token]).expect(200);
    });
  });

  describe('POST /api/blogs/blog', () => {
    test('create a blog - success', async () => {
      const blog = {
        title: 'A Random Title',
        content: 'Random Content',
      };
      await api.post(`${baseBlog}/blog`).set('Cookie', [token]).send(blog);
      expect(201);
      const res = await api.get(`${baseBlog}/all`).set('Cookie', [token]);
      expect(res.body).toHaveLength(2);
    });

    test('create a blog - missing title or content', async () => {
      const blog = {
        content: 'Random Content',
      };
      await api.post(`${baseBlog}/blog`).set('Cookie', [token]).send(blog);
      expect(422);
    });
  });

  describe('PUT /api/blogs/blog/:id', () => {
    test('blog update - incomplete input', async () => {
      const update = {
        title: 'Updated Title',
      };
      await api
        .put(`${baseBlog}/blog/${blogID}`)
        .set('Cookie', [token])
        .send(update)
        .expect(422);
    });

    test('blog update - success', async () => {
      const update = {
        title: 'Updated Title',
        content: 'Updated Content',
      };
      await api
        .put(`${baseBlog}/blog/${blogID}`)
        .set('Cookie', [token])
        .send(update)
        .expect(202);
      const res = await api.get(`${baseBlog}/all`).set('Cookie', [token]);
      const current = res.body.find((blog: IBlog) => blog.id === blogID);
      expect(current.title).toEqual('Updated Title');
    });
  });

  describe('DELETE /api/blogs/:id', () => {
    test('delete blog', async () => {
      const blogs = await api.get(`${baseBlog}/all`).set('Cookie', [token]);
      await api
        .delete(`${baseBlog}/blog/${blogs.body[1].id}`)
        .set('Cookie', [token])
        .expect(200);
      const res = await api.get(`${baseBlog}/all`).set('Cookie', [token]);
      expect(res.body).toHaveLength(1);
    });
  });
});

describe('comment routes', () => {
  beforeAll(async () => {
    await Comment.deleteMany({});
  });
  describe('POST /api/comments/:id', () => {
    test('create comment - success', async () => {
      const comment = {
        comment_content: 'A new comment',
      };
      await api
        .post(`/api/comments/${blogID}`)
        .set('Cookie', [token])
        .send(comment)
        .expect(201);
    });

    test('create comment - missing content', async () => {
      await api
        .post(`/api/comments/${blogID}`)
        .set('Cookie', [token])
        .send()
        .expect(422);
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
