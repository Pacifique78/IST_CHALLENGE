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

      expect(response.status).toBe(201);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.name).toBe(testUser.name);
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user).not.toHaveProperty('password');
      expect(response.body.user).toHaveProperty('created_at');
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

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Email already registered');
    });

    it('should validate email format', async () => {
      const invalidUser = { ...testUser, email: 'invalid-email' };
      const response = await request(app)
        .post('/api/signup')
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Invalid email format');
    });

    it('should require all fields', async () => {
      const incompleteUser = { name: 'Test User' };
      const response = await request(app)
        .post('/api/signup')
        .send(incompleteUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Name, email, and password are required');
    });

    it('should validate password length', async () => {
      const weakPasswordUser = { ...testUser, password: '123' };
      const response = await request(app)
        .post('/api/signup')
        .send(weakPasswordUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Password must be at least 6 characters long');
    });

    it('should validate name length', async () => {
      const shortNameUser = { ...testUser, name: 'A' };
      const response = await request(app)
        .post('/api/signup')
        .send(shortNameUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Name must be at least 2 characters long');
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

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Invalid email or password');
    });

    it('should not login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'nonexistent@example.com',
          password: testUser.password
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Invalid email or password');
    });

    it('should require both email and password', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: testUser.email
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Email and password are required');
    });
  });
});