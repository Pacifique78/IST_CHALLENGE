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
    console.log('\n--- Setting up test user ---');
    // Create user
    const signupResponse = await request(app)
      .post('/api/signup')
      .send(testUser);
    console.log('Signup Response:', JSON.stringify(signupResponse.body, null, 2));

    // Login and get token
    const loginResponse = await request(app)
      .post('/api/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });
    console.log('Login Response:', JSON.stringify(loginResponse.body, null, 2));

    authToken = loginResponse.body.token;
    console.log('Auth Token:', authToken?.substring(0, 20) + '...');
  });

  describe('POST /api/todos', () => {
    it('should create a new todo successfully', async () => {
      console.log('\n--- Testing todo creation ---');
      console.log('Test Todo Data:', testTodo);
      console.log('Using Auth Token:', authToken);

      const response = await request(app)
        .post('/api/todos')
        .set('Authorization', `${authToken}`)
        .send(testTodo);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('title', testTodo.title);
      expect(response.body).toHaveProperty('description', testTodo.description);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('email');
      expect(response.body.user).toHaveProperty('name');
    });

    it('should require authentication', async () => {
      console.log('\n--- Testing todo creation without auth ---');
      const response = await request(app)
        .post('/api/todos')
        .send(testTodo);

      console.log('Response Status:', response.status);
      console.log('Response Body:', JSON.stringify(response.body, null, 2));

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/todos', () => {
    beforeEach(async () => {
      console.log('\n--- Setting up test todos ---');
      // Create some test todos
      const firstTodoResponse = await request(app)
        .post('/api/todos')
        .set('Authorization', `${authToken}`)
        .send(testTodo);
      console.log('First Todo Created:', JSON.stringify(firstTodoResponse.body, null, 2));

      await request(app)
        .post('/api/todos')
        .set('Authorization', `${authToken}`)
        .send({
          title: 'Second Todo',
          description: 'Another Description'
        });
    });

    it('should get all todos for user', async () => {
      console.log('\n--- Testing get all todos ---');
      const response = await request(app)
        .get('/api/todos')
        .set('Authorization', `${authToken}`);

      console.log('Response Status:', response.status);
      console.log('Todos Retrieved:', JSON.stringify(response.body, null, 2));

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('description');
      expect(response.body[0]).toHaveProperty('user');
    });

    it('should handle empty todo list', async () => {
      console.log('\n--- Testing empty todo list ---');
      const newUser: IUserSignup = {
        name: 'New User',
        email: 'new@example.com',
        password: 'newpass123'
      };

      console.log('Creating new user:', newUser.email);
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
      console.log('New User Token:', newUserToken?.substring(0, 20) + '...');

      const response = await request(app)
        .get('/api/todos')
        .set('Authorization', `${newUserToken}`);

      console.log('Response Status:', response.status);
      console.log('Response Body:', JSON.stringify(response.body, null, 2));

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });

    it('should require authentication', async () => {
      console.log('\n--- Testing get todos without auth ---');
      const response = await request(app)
        .get('/api/todos');

      console.log('Response Status:', response.status);
      console.log('Response Body:', JSON.stringify(response.body, null, 2));

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/todos/:id', () => {
    let todoId: string;

    beforeEach(async () => {
      console.log('\n--- Creating test todo for ID tests ---');
      // First create the todo
      await request(app)
        .post('/api/todos')
        .set('Authorization', `${authToken}`)
        .send(testTodo);

      // Then get all todos to find its ID
      const getTodosResponse = await request(app)
        .get('/api/todos')
        .set('Authorization', `${authToken}`);
      
      todoId = getTodosResponse.body[0].id;
      console.log('Test Todo ID:', todoId);
    });

    it('should get a specific todo by id', async () => {
      console.log('\n--- Testing get todo by ID ---');
      const response = await request(app)
        .get(`/api/todos/${todoId}`)
        .set('Authorization', `${authToken}`);

      console.log('Response Status:', response.status);
      console.log('Response Body:', JSON.stringify(response.body, null, 2));

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title', testTodo.title);
      expect(response.body).toHaveProperty('description', testTodo.description);
    });

    it('should return 404 for non-existent todo', async () => {
      console.log('\n--- Testing non-existent todo ID ---');
      const fakeId = '123e4567-e89b-12d3-a456-426614174000';
      console.log('Fake Todo ID:', fakeId);

      const response = await request(app)
        .get(`/api/todos/${fakeId}`)
        .set('Authorization', `${authToken}`);

      console.log('Response Status:', response.status);
      console.log('Response Body:', JSON.stringify(response.body, null, 2));

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Todo not found');
    });

    it('should not allow access to another user\'s todo', async () => {
      console.log('\n--- Testing todo access with different user ---');
      const anotherUser: IUserSignup = {
        name: 'Another User',
        email: 'another@example.com',
        password: 'pass123'
      };

      console.log('Creating another user:', anotherUser.email);
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
      console.log('Another User Token:', anotherToken?.substring(0, 20) + '...');
      console.log('Attempting to access Todo ID:', todoId);

      const response = await request(app)
        .get(`/api/todos/${todoId}`)
        .set('Authorization', `${anotherToken}`);

      console.log('Response Status:', response.status);
      console.log('Response Body:', JSON.stringify(response.body, null, 2));

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Todo not found');
    });

    it('should require authentication', async () => {
      console.log('\n--- Testing todo access without auth ---');
      const response = await request(app)
        .get(`/api/todos/${todoId}`);

      console.log('Response Status:', response.status);
      console.log('Response Body:', JSON.stringify(response.body, null, 2));

      expect(response.status).toBe(401);
    });

    it('should handle invalid UUID format', async () => {
      console.log('\n--- Testing invalid UUID format ---');
      const invalidId = 'invalid-uuid';
      console.log('Invalid Todo ID:', invalidId);

      const response = await request(app)
        .get(`/api/todos/${invalidId}`)
        .set('Authorization', `${authToken}`);

      console.log('Response Status:', response.status);
      console.log('Response Body:', JSON.stringify(response.body, null, 2));

      expect(response.status).toBe(500);
    });
  });
});