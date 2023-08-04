# Task Manager Frontend

This repository contains the frontend representation of the Task Manager System. The Task Manager is a project management tool that allows users to efficiently manage their tasks, track progress, and collaborate with team members. The frontend provides an intuitive and user-friendly interface for interacting with the Task Manager system.

## Stack

The frontend is built using the following technologies:

- React: A popular JavaScript library for building dynamic user interfaces.
- TypeScript: A typed superset of JavaScript that enables static type-checking and improves code maintainability.
- Jest: A testing framework for JavaScript and TypeScript applications, used for writing unit and integration tests.
- Material-UI: A UI component library for React that provides pre-designed components for creating attractive and responsive user interfaces.

## Layout

The frontend is designed with a clean and modern layout, consisting of three main pages:

1. **Login**: The login page allows users to authenticate themselves by providing their credentials. Upon successful login, users gain access to the dashboard.

2. **Create User**: This page enables new users to register and create an account to use the Task Manager system.

3. **Dashboard**: The dashboard is designed to resemble a simplified Kanban board, similar to Jira's board. Tasks are displayed under various status columns, including ToDo, InProgress, Blocked, InQA, Done, and Deployed. Users can easily drag and drop tasks between these columns to update their status, providing a seamless workflow experience. The dashboard layout is responsive and supports both desktop and small screens.

Each task on the dashboard is represented by a card containing three icons:

- **History**: Clicking on this icon allows users to view the task history in a list, ordered by the time of updates. Users can easily track the changes made to the task over time.

- **Assign Users**: This icon provides the functionality to assign the task to other team members, promoting collaboration and efficient task allocation.

- **Edit Task**: By clicking on this icon, users can easily edit the task's title and description, facilitating quick updates to task details.

## How to Start

To run the Task Manager frontend on your local machine, follow these steps:

```bash
npm install
npm start
```

## Screenshots

<!-- Add some screenshots of the app here to showcase its appearance -->
