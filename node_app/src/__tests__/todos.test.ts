import app from 'src/app';
import { ITodoCreate, IUserSignup } from 'src/types/custom';
import request from 'supertest';

describe('Todo Routes', () => {
  let authToken: string;
  const testUser: IUserSignup = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'testpass123'
  };

  const testTodo: ITodoCreate = {
    title: 'Test Todo',
    description: 'Test Description'
  };

  beforeEach(async () => {
    // Create user
    await request(app)
      .post('/api/signup')
      .send(testUser);

    // Login and get token
    const loginResponse = await request(app)
      .post('/api/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    authToken = loginResponse.body.token;
  });

  describe('POST /todos', () => {
    it('should create a new todo successfully', async () => {
      const response = await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testTodo);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(testTodo.title);
      expect(response.body.description).toBe(testTodo.description);
      expect(response.body.completed).toBe(false);
      expect(response.body).toHaveProperty('created_at');
      expect(response.body).toHaveProperty('updated_at');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/todos')
        .send(testTodo);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should require title', async () => {
      const invalidTodo = { description: 'Test Description' };
      const response = await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidTodo);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Title is required');
    });

    it('should handle empty title', async () => {
      const invalidTodo = { ...testTodo, title: '' };
      const response = await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidTodo);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Title cannot be empty');
    });

    it('should handle very long title', async () => {
      const longTitle = 'a'.repeat(101); // More than 100 characters
      const invalidTodo = { ...testTodo, title: longTitle };
      const response = await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidTodo);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Title must be less than 100 characters');
    });
  });

  describe('GET /todos', () => {
    beforeEach(async () => {
      // Create some test todos
      await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testTodo);

      await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Second Todo',
          description: 'Another Description'
        });
    });

    it('should get all todos for user', async () => {
      const response = await request(app)
        .get('/todos')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('description');
      expect(response.body[0]).toHaveProperty('completed');
      expect(response.body[0]).toHaveProperty('created_at');
      expect(response.body[0]).toHaveProperty('updated_at');
    });

    it('should handle empty todo list', async () => {
      // Create a new user and get their todos (should be empty)
      const newUser: IUserSignup = {
        name: 'New User',
        email: 'new@example.com',
        password: 'newpass123'
      };

      await request(app)
        .post('/api/signup')
        .send(newUser);

      const loginResponse = await request(app)
        .post('/api/login')
        .send({
          email: newUser.email,
          password: newUser.password
        });

      const newUserToken = loginResponse.body.token;

      const response = await request(app)
        .get('/todos')
        .set('Authorization', `Bearer ${newUserToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/todos');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /todos/:id', () => {
    let todoId: string;

    beforeEach(async () => {
      // Create a test todo and store its ID
      const createResponse = await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(testTodo);

      todoId = createResponse.body.id;
    });

    it('should get a specific todo by id', async () => {
      const response = await request(app)
        .get(`/todos/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(todoId);
      expect(response.body.title).toBe(testTodo.title);
      expect(response.body.description).toBe(testTodo.description);
      expect(response.body).toHaveProperty('completed');
      expect(response.body).toHaveProperty('created_at');
      expect(response.body).toHaveProperty('updated_at');
    });

    it('should return 404 for non-existent todo', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000';
      const response = await request(app)
        .get(`/todos/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Todo not found');
    });

    it('should not allow access to another user\'s todo', async () => {
      // Create another user
      const anotherUser: IUserSignup = {
        name: 'Another User',
        email: 'another@example.com',
        password: 'pass123'
      };

      await request(app)
        .post('/api/signup')
        .send(anotherUser);

      const loginResponse = await request(app)
        .post('/api/login')
        .send({
          email: anotherUser.email,
          password: anotherUser.password
        });

      const anotherToken = loginResponse.body.token;

      // Try to access first user's todo with second user's token
      const response = await request(app)
        .get(`/todos/${todoId}`)
        .set('Authorization', `Bearer ${anotherToken}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Todo not found');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get(`/todos/${todoId}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle invalid UUID format', async () => {
      const response = await request(app)
        .get('/todos/invalid-uuid')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid todo ID format');
    });
  });
});