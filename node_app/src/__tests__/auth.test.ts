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

  });
});
