import supertest from "supertest";

import express from "express";
import routers from "../routes/routers";
import cors from "cors";
import { clearTestDatabase, closeDatabasePool } from "../db/database";

const app = express();
app.use(express.json());
app.use(cors());
app.use(routers);

const request = supertest(app);

let createdUserId: any;
let createdTaskId: any;
let newUserId: any;
let user1Name = "Ahmed Zeno";

describe("Integration tests", () => {
  beforeAll(async () => {
    //clear the test database
    await clearTestDatabase();
  });

  afterAll(async () => {
    //clear the test database
    await clearTestDatabase();
    closeDatabasePool();
  });

  test("should return 400 if required fields are missing", async () => {
    const requestBody = {
      // Missing required fields
    };

    const response = await request.post("/tasks").send(requestBody);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Missing required fields" });
  });

  test("should create a user", async () => {
    // Test data
    const userData = {
      name: user1Name,
      email: `testuser${new Date()}@example.com`,
      password: "testpassword",
    };

    // Make a request to create the user
    const response = await request.post("/users").send(userData);

    // Check the response status code
    expect(response.status).toBe(201);

    // Check the response body
    expect(response.body).toEqual({
      message: "User created successfully",
      userId: expect.any(Number),
      name: user1Name,
    });

    // Save the created user ID for later tests
    createdUserId = response.body.userId;
  });

  test("should create a task by the user", async () => {
    // Test data
    const taskData = {
      title: "Test Task",
      description: "Test Task Description",
      createdBy: createdUserId,
    };

    // Make a request to create the task
    const response = await request.post("/tasks").send(taskData);

    // Check the response status code
    expect(response.status).toBe(201);

    // Check the response body
    expect(response.body).toEqual({
      id: expect.any(Number),
      title: taskData.title,
      description: taskData.description,
      status: "ToDo",
      createdBy: taskData.createdBy,
      createdAt: expect.any(String),
    });

    // Save the created task ID for later tests
    createdTaskId = response.body.id;
  });

  test("should get task history for task creation", async () => {
    // Make a request to get the task history for task creation
    const response = await request.get(`/tasks/${createdTaskId}/history`);

    // Check the response status code
    expect(response.status).toBe(200);

    // Check that the response body has a length of 2
    expect(response.body.length).toBe(2);

    // Check that the response body has the required attributes
    expect(response.body[0]).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        taskId: expect.any(Number),
        field: "title",
        oldValue: "",
        newValue: expect.any(String),
        changedBy: expect.any(Number),
        changedAt: expect.any(String),
        message: expect.any(String),
      })
    );

    // Check that the 'changedBy' property equals the createdUserId
    expect(response.body[0].changedBy).toBe(createdUserId);
  });

  test("should fail updating task due to invalid updatedBy", async () => {
    // Prepare data with a non-existent user ID
    const updateData = {
      title: "New Title",
      description: "Updated Description",
      updatedBy: 9999999999, // Assuming this user ID doesn't exist
    };

    // Attempt to update the task
    const response = await request
      .put(`/tasks/${createdTaskId}`)
      .send(updateData);

    // Expect the server to respond with a 500 due to the database transaction failure
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal server error" });
  });

  test("should update task status", async () => {
    // Test data
    const updateData = {
      status: "InProgress",
      updatedBy: createdUserId,
    };

    // Make a request to update the task status
    const response = await request
      .put(`/tasks/${createdTaskId}/status`)
      .send(updateData);

    // Check the response status code
    expect(response.status).toBe(200);

    // Make sure the task status is updated
    expect(response.body).toEqual({
      message: "Task status updated successfully",
    });
  });

  test("should get task history for task status update", async () => {
    // Make a request to get the task history for task status update
    const response = await request.get(`/tasks/${createdTaskId}/history`);

    // Check the response status code
    expect(response.status).toBe(200);
    // Check that the response body has a length of 2
    expect(response.body.length).toBe(3);

    // Check that the response body has the required attributes
    expect(response.body[2]).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        taskId: expect.any(Number),
        field: "status",
        oldValue: "ToDo",
        newValue: "InProgress",
        changedBy: expect.any(Number),
        changedAt: expect.any(String),
        message: expect.any(String),
      })
    );

    // Check that the 'changedBy' property equals the createdUserId
    expect(response.body[2].changedBy).toBe(createdUserId);

    //assert that the message contains the expected part
    const expectedMessagePart = `changed Task status from "ToDo" to "InProgress" at`;
    expect(response.body[2].message).toContain(expectedMessagePart);
  });

  test("should create another user", async () => {
    // Test data
    const userData = {
      name: "New User",
      email: `newuser${new Date()}@example.com`,
      password: "testpassword",
    };

    // Make a request to create the new user
    const response = await request.post("/users").send(userData);

    // Check the response status code
    expect(response.status).toBe(201);

    // Check the response body
    expect(response.body).toEqual({
      message: "User created successfully",
      userId: expect.any(Number),
      name: "New User",
    });

    // Save the created user ID for later tests
    newUserId = response.body.userId;
  });

  test("should assign the created task to the new user", async () => {
    // Test data
    const assignData = {
      updatedBy: createdUserId,
      assignedUserName: "New User",
    };

    // Make a request to assign the task to the new user
    const response = await request
      .put(`/tasks/${createdTaskId}/assign/${newUserId}`)
      .send(assignData);

    // Check the response status code
    expect(response.status).toBe(200);

    // Make sure the task is assigned to the new user
    expect(response.body).toEqual({
      message: "Task assigned successfully",
    });
  });

  test("should get task history for task assignment", async () => {
    // Make a request to get the task history for task assignment
    const response = await request.get(`/tasks/${createdTaskId}/history`);

    // Check the response status code
    expect(response.status).toBe(200);

    const assignedTaskhistory = response.body.find(
      (task: any) => task.field === "assignedTo"
    );

    // Check that the 'changedBy' property equals the createdUserId
    expect(assignedTaskhistory.changedBy).toBe(createdUserId);

    //assert that the message contains the expected part
    const expectedMessagePart = `User "Ahmed Zeno" assigned this Task to "New User" at`;
    expect(assignedTaskhistory.message).toContain(expectedMessagePart);
  });
  test("should get tasks list", async () => {
    // Make a request to get the task list
    const response = await request.get(`/tasks`);

    // Check the response status code
    expect(response.status).toBe(200);

    expect(response.body.length).toBeGreaterThan(0);

    expect(response.body[0].assignedToName).toBe("New User");
  });
});
