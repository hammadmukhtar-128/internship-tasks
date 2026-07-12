require('./setup');
require('dotenv').config();
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test_refresh_secret';

const request = require('supertest');
const app = require('../app');

describe('Auth API', () => {
  const userPayload = {
    fullName: 'Test User',
    email: 'testuser@example.com',
    password: 'Password123!'
  };

  it('should register a new user', async () => {
    const res = await request(app).post('/api/v1/auth/register').send(userPayload);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(userPayload.email);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it('should not register with an existing email', async () => {
    await request(app).post('/api/v1/auth/register').send(userPayload);
    const res = await request(app).post('/api/v1/auth/register').send(userPayload);
    expect(res.statusCode).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('should login with valid credentials', async () => {
    await request(app).post('/api/v1/auth/register').send(userPayload);
    const res = await request(app).post('/api/v1/auth/login').send({
      email: userPayload.email,
      password: userPayload.password
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it('should reject login with invalid credentials', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'nonexistent@example.com',
      password: 'wrongpassword'
    });
    expect(res.statusCode).toBe(401);
  });

  it('should get the logged-in user profile', async () => {
    const registerRes = await request(app).post('/api/v1/auth/register').send(userPayload);
    const token = registerRes.body.data.accessToken;

    const res = await request(app).get('/api/v1/auth/profile').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.user.email).toBe(userPayload.email);
  });

  it('should reject profile access without a token', async () => {
    const res = await request(app).get('/api/v1/auth/profile');
    expect(res.statusCode).toBe(401);
  });
});
