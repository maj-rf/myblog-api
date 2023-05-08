import mongoose from 'mongoose';
import supertest from 'supertest';
import { User } from '../models/user';
import app from '../app';

const api = supertest(app);
let token = '';

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
    expect(token).toBeDefined();
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

afterAll(async () => {
  await mongoose.connection.close();
});
