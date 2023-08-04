# Task Manager

Task Manager is a comprehensive project management system designed to help users efficiently manage their tasks, track progress, and collaborate with team members. The project consists of both backend and frontend components, which work together to provide a seamless and user-friendly experience for managing tasks.

## Backend

The backend of the Task Manager system is responsible for handling data storage, business logic, and API endpoints. It is built using Node.js with TypeScript and employs a simple Express.js application. The backend uses Docker containers to manage both the development and testing databases, which are based on MySQL2. The main tables in the database are users, tasks, and task_history, with proper relationships between them to ensure data integrity.

For more details about the backend, including the available API routes and functionalities, please refer to the [Backend README.md](/kabs-backend/README.md).

## Frontend

The frontend of the Task Manager system provides an intuitive and user-friendly interface for interacting with the task management features. It is built using React with TypeScript and leverages Material-UI for designing attractive and responsive user interfaces. The frontend layout includes three main pages: login, create user, and dashboard. The dashboard is designed to resemble a simplified Kanban board, allowing users to drag and drop tasks between different status columns.

To explore the frontend functionalities and layout in detail, please check the [Frontend README.md](/kabs-Frontend/README.md).

## Functionality

The Task Manager project supports the following key functionalities:

- User Authentication: Users can log in to access the dashboard and perform task management operations.

- Task Management: Users can create, view, edit, and delete tasks. The dashboard provides a Kanban board-like layout for managing tasks efficiently.

- Task History: The system tracks and displays the history of each task, allowing users to view previous updates and changes.

- Task Assignment: Users can assign tasks to other team members for efficient task allocation and collaboration.

## Getting Started

Clone the repository:

```bash
git clone https://github.com/jadzeino/TaskManager-CC.git
cd TaskManager
```

Start the backend and frontend:

### Backend:

Please follow the instructions provided in the Backend README.md to start the backend server.

### Frontend:

Please refer to the Frontend README.md for instructions on starting the frontend.

With the Task Manager system up and running, you can now explore its various features and functionalities to effectively manage your tasks and enhance team collaboration.

### Note

Please note that the current implementation of the Task Manager project is focused on core functionality and smooth user interactions. As a result, some test cases may not be fully covered. Additionally, certain features, such as pagination and lazy loading, have not been implemented yet, but can be added in future iterations. We welcome any feedback, suggestions, or contributions to improve the Task Manager system and make it even more powerful and efficient.

Happy task managing!

![Sign In](https://github.com/jadzeino/TaskManager-CC/raw/main/public/Screenshot 2023-08-04-at-14.51.23.png)

![Create User In](https://github.com/jadzeino/TaskManager-CC/raw/main/public/Screenshot 2023-08-04-at-14.51.36.png)

![Dashboard](https://github.com/jadzeino/TaskManager-CC/raw/main/public/Screenshot 2023-08-04-at-14.58.27.png)

![Edit Task](https://github.com/jadzeino/TaskManager-CC/raw/main/public/Screenshot 2023-08-04-at-14.59.36.png)

![Assign Task](https://github.com/jadzeino/TaskManager-CC/raw/main/public/Screenshot 2023-08-04-at-15.02.55.png)

![Task History](https://github.com/jadzeino/TaskManager-CC/raw/main/public/Screenshot 2023-08-04-at-15.03.26.png)

![Task Status](https://github.com/jadzeino/TaskManager-CC/raw/main/public/Screenshot 2023-08-04-at-15.04.23.png)

