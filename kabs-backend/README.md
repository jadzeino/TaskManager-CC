# KABS-BACKEND

KABS-BACKEND is a backend repository for a Task Manager application. The purpose of this repository is to handle the server-side functionalities for managing tasks and users in the Task Manager system.

## Backend Structure

The backend is built using Node.js and TypeScript, along with a simple Express app to handle API routes. The backend utilizes MySQL as the database for storing tasks, users, and task history.

### Database Structure

The database schema consists of the following main tables:

1. **users**: Contains user information such as name, email, and password. The table is used for user authentication and task assignments.

2. **tasks**: Stores the details of individual tasks, including title, description, status, createdBy, updatedBy, createdAt, updatedAt, and assignedTo. The table maintains relationships with the 'users' table for createdBy, updatedBy, and assignedTo fields.

3. **task_history**: Records the history of changes made to tasks. It includes fields like taskId, field, oldValue, newValue, changedBy, changedAt, and message. The 'task_history' table is linked to the 'tasks' and 'users' tables for maintaining foreign key relationships.

### Available APIs and Routes

The following APIs are available in the KABS-BACKEND:

1. **Create Task**: `POST /tasks`

   - Params/Body: title (string), description (string), createdBy (number)
   - Response Example: `{ "id": 1, "title": "Task 1", "description": "Description for Task 1", "status": "ToDo", "createdBy": 1, "createdAt": "2023-08-03T12:00:00.000Z" }`

2. **Update Task Status**: `PUT /tasks/:taskId/status`

   - Params: taskId (number)
   - Body: status (string), updatedBy (number)
   - Response Example: `{ "message": "Task status updated successfully" }`

3. **Update Task Title and Description**: `PUT /tasks/:taskId`

   - Params: taskId (number)
   - Body: assignedUserName (string), updatedBy (number)
   - Response Example: `{ "message": "Task title and description updated successfully" }`

4. **Assign Task to User**: `PUT /tasks/:taskId/assign/:userId`

   - Params: taskId (number), userId (number)
   - Body: title (string), description (string), updatedBy (number)
   - Response Example: `{ "message": "Task assigned successfully" }`

5. **Get Task History**: `GET /tasks/:taskId/history`

   - Params: taskId (number)
   - Response Example: `[{ "id": 1, "taskId": 1, "field": "status", "oldValue": null, "newValue": "ToDo", "changedBy": 1, "changedAt": "2023-8-03T12:00:00.000Z", "message": "User 'User 1' created this Task at '2023-08-03T12:00:00.000Z'" }]`

6. **Get All Tasks**: `GET /tasks`

   - Response Example: `[{ "id": 1, "title": "Task 1", "description": "Description for Task 1", "status": "ToDo", "createdBy": 1, "createdAt": "2023-08-03T12:00:00.000Z" }]`

7. **Get All Users**: `GET /users`

   - Response Example: `[{ "id": 1, "name": "User 1", "email": "user1@example.com" }]`

8. **Get User By ID**: `GET /users/:id`

   - Params: id (number)
   - Response Example: `{ "id": 1, "name": "User 1", "email": "user1@example.com" }`

9. **Create User**: `POST /users`

   - Body: name (string), email (string), password (string)
   - Response Example: `{ "id": 1, "name": "User 1", "email": "user1@example.com" }`

10. **Update User**: `PUT /users/:id`

    - Params: id (number)
    - Body: name (string), email (string)
    - Response Example: `{ "message": "User updated successfully" }`

11. **Delete User**: `DELETE /users/:id`

    - Params: id (number)
    - Response Example: `{ "message": "User deleted successfully" }`

12. **Login User**: `POST /login`
    - Body: email (string), password (string)
    - Response Example: `{ "id": 1, "name": "User 1", "email": "user1@example.com" }`

## Note

The KABS-BACKEND repository provides the basic functionalities for the Task Manager application. To simplify development and avoid spending excessive time on certain tasks, some features like middlewares for assertions, adding Models, authorisation,UDID and pagination mechanisms have not been implemented. Additionally, database optimizations have not been explored.

## Getting Started

To start the KABS-BACKEND repository, follow these steps:

1. Run `npm install` to install the required dependencies.
2. Run `npm run build:db` to create and seed the database with dummy data.
3. Run `npm start` to start the server and run the backend application.

## Postman Collection

A Postman collection has been included in the repository for testing the APIs. You can import the collection into Postman to test the available endpoints easily.
