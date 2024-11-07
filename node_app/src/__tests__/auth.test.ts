import request from 'supertest';
import app from 'src/app';
import { IUserSignup } from 'src/types/custom';

describe('Auth Routes', () => {
  const testUser: IUserSignup = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'testpass123'
  };

  describe('POST /api/signup', () => {
    it('should create a new user successfully', async () => {
      const response = await request(app)
        .post('/api/signup')
        .send(testUser);
      
      // Debug logging
      console.log('Signup Response:', JSON.stringify(response.body, null, 2));
      
      expect(response.status).toBe(201);
      // Updated to match your controller response format
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(testUser.name);
      expect(response.body.email).toBe(testUser.email);
      expect(response.body).not.toHaveProperty('password');
      expect(response.body).toHaveProperty('createdAt');
    });

    it('should not allow duplicate emails', async () => {
      // First signup
      await request(app)
        .post('/api/signup')
        .send(testUser);
      
      // Try to signup with same email
      const response = await request(app)
        .post('/api/signup')
        .send(testUser);

      console.log('Duplicate Email Response:', JSON.stringify(response.body, null, 2));

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('User exist');
    });

  });

  describe('POST /api/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/signup')
        .send(testUser);
    });

    it('should login successfully', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      console.log('Login Success Response:', JSON.stringify(response.body, null, 2));

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user.name).toBe(testUser.name);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should not login with wrong password', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: testUser.email,
          password: 'wrongpass'
        });

      console.log('Wrong Password Response:', JSON.stringify(response.body, null, 2));

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should not login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'nonexistent@example.com',
          password: testUser.password
        });

      console.log('Non-existent Email Response:', JSON.stringify(response.body, null, 2));

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('User not found');
    });

    it('should require both email and password', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: testUser.email
        });

      console.log('Missing Login Fields Response:', JSON.stringify(response.body, null, 2));

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Login failed');
    });
  });
});
