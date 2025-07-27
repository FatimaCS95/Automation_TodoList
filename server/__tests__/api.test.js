// server/__tests__/api.test.js

const supertest = require('supertest');
const app = require('../server');
const pool = require('../modules/pool');

const api = supertest(app);

// ===================================
//  API Test Suite for To-Do App
// ===================================
describe('API Endpoints', () => {
  let token;
  let createdTaskId;

  const testUser = {
    username: `api_user_${Date.now()}`,
    password: 'password123',
  };

  // This runs ONCE before any tests in this file.
  beforeAll(async () => {
    // --- FIX #1: CLEAN ALL RELEVANT TABLES ---
    // We must clean tables in the correct order to respect foreign keys.
    // Clean 'task' first, then 'users', then 'category'.
    await pool.query('DELETE FROM "task"');
    await pool.query('DELETE FROM "users"');
    await pool.query('DELETE FROM "category"');

    // --- FIX #2: SEED THE CATEGORY TABLE ---
    // This ensures that a category with ID=1 exists for our tests.
     await pool.query(`
    INSERT INTO "category" ("id", "name")
    VALUES 
      (1, 'Work'), 
      (2, 'Personal'), 
      (3, 'Chores'),
      (4, 'Health');
  `);

    // --- FIX #3: MAKE SURE REGISTRATION/LOGIN USES THE CORRECT USER ---
    // Register our test user
    await api.post('/api/user/register').send(testUser);

    // Log in as the test user to get the token
    const response = await api.post('/api/user/login').send(testUser);
    token = response.body.token;
  });

  // After all tests are done, disconnect from the database.
  afterAll(async () => {
    // A slight delay can help ensure all operations are complete
    await new Promise(resolve => setTimeout(resolve, 500));
    pool.end();
  });


  // --- AUTHENTICATION TESTS ---
  describe('POST /api/user/login', () => {
    it('should fail with incorrect credentials (Negative Case)', async () => {
      await api
        .post('/api/user/login')
        .send({ username: testUser.username, password: 'wrongpassword' })
        .expect(401); // The server should correctly respond with 401 now.
    });
  });


  // --- TASK (ITEMS) TESTS ---
  describe('Task API /api/task', () => {
    it('should FAIL to create a task without an auth token (Negative Case)', async () => {
      await api.post('/api/task').send({ description: 'This should fail' }).expect(401);
    });

    it('should create a new task with a valid token (Positive Case)', async () => {
      const newTask = {
        description: 'A task created by an API test',
        category: 1, // This will now succeed because a category with ID=1 exists.
      };
      
      const response = await api
        .post('/api/task')
        .set('x-auth-token', token)
        .send(newTask)
        .expect(201);
      
      // --- FIX #4: CAPTURE THE TASK ID FROM THE GET REQUEST ---
      // This makes the test flow more logical: create, then verify it exists.
    });

    it('should return the list of tasks for the authenticated user (Positive Case)', async () => {
      const response = await api
        .get('/api/task')
        .set('x-auth-token', token)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0); // This will now pass
      // Save the ID of the task we just created for the next tests
      createdTaskId = response.body[0].id;
      expect(createdTaskId).toBeDefined();
    });

    it('should update the specified task (Positive Case)', async () => {
      const updatedTaskData = {
        description: 'This task description was updated by a test',
      };
      await api
        .put(`/api/task/${createdTaskId}`) // This will now have a valid ID
        .set('x-auth-token', token)
        .send(updatedTaskData)
        .expect(200);
    });

    it('should delete the specified task (Positive Case)', async () => {
      await api
        .delete(`/api/task/${createdTaskId}`) // This will now have a valid ID
        .set('x-auth-token', token)
        .expect(204);
    });
  });
});