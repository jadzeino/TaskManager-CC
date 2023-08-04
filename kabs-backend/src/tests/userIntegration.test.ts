import supertest from 'supertest';
import express from "express";
import routers from '../routes/routers';
import cors from 'cors';
import { pool } from '../db/database';
import bcrypt from 'bcrypt';
import { createUser } from '../controllers/userController';

const app = express();
app.use(express.json());
app.use(cors());
app.use(routers);

const request = supertest(app);

let createdUserId: any;
let createdUserEmail: string;

// Helper function to clear the users table
async function clearUsersTable() {
  await pool.query('DELETE FROM users');
}

afterAll(async () => {
  // Clear the users table before each test
  await clearUsersTable();
});

describe('Integration tests for user endpoints', () => {
  test('should create a user', async () => {
    const userData = {
      name: 'Ahmed Zeno',
      email: `az@example.com`,
      password: 'password123',
    };

    // Make a request to create the new user
    const response = await request.post('/users').send(userData);

    // Check the response status code
    expect(response.status).toBe(201);

    // Check the response body
    expect(response.body).toEqual({
      message: 'User created successfully',
      userId: expect.any(Number),
      name: 'Ahmed Zeno'
    });

    // Save the created user ID and email for later tests
    createdUserId = response.body.userId;
    createdUserEmail = userData.email;
  });

  test('should get all users', async () => {

    // Make a request to get all users
    const response = await request.get('/users');

    // Check the response status code
    expect(response.status).toBe(200);

    // Check that the response body is an array and contains at least one user
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(1);

    // Check that each user has the required attributes
    const user = response.body[0];
    expect(user).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        email: expect.any(String),
      })
    );
  });

  test('should login a user', async () => {

    const loginData = {
      email: 'az@example.com',
      password: 'password123',
    };

    // Make a request to login the user
    const response = await request.post('/login').send(loginData);

    // Check the response status code
    expect(response.status).toBe(200);

    // Check the response body
    expect(response.body).toEqual({
      message: 'Login successful',
      userId: expect.any(Number),
      name: 'Ahmed Zeno',
      email: 'az@example.com',
    });
  });

  test('should update a user by ID', async () => {

    const updatedUserData = {
      name: 'Updated User',
      email: 'az2@example.com',
    };

    // Make a request to update the user by ID
    const response = await request.put(`/users/${createdUserId}`).send(updatedUserData);

    // Check the response status code
    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      "message": 'User updated successfully'
    });

    // Check that the user is updated in the database
    const [userRows] = await pool.query<any>('SELECT * FROM users WHERE id = ?', [createdUserId]);
    const updatedUser = userRows[0];
    expect(updatedUser).toEqual(
      expect.objectContaining({
        id: createdUserId,
        name: updatedUserData.name,
        email: updatedUserData.email,
      })
    );
  });

  test('should delete a user by ID', async () => {

    // Make a request to delete the user by ID
    const response = await request.delete(`/users/${createdUserId}`);

    // Check the response status code
    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      "message": 'User deleted successfully',
    });

    // Make sure the user is deleted from the database
    const [userRows] = await pool.query<any>('SELECT * FROM users WHERE id = ?', [createdUserId]);
    expect(userRows.length).toBe(0);
  });
});
