-- Create the database
CREATE DATABASE IF NOT EXISTS test_db;

-- Use the database
USE test_db;

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL -- Add the password field
);

-- Create the tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status ENUM('ToDo', 'InProgress', 'Blocked', 'InQA', 'Done', 'Deployed') NOT NULL DEFAULT 'ToDo',
  createdBy INT NOT NULL, -- Use the userId as a foreign key
  updatedBy INT DEFAULT NULL, -- Use the userId as a foreign key for the user who last updated the task
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME DEFAULT NULL, -- Add a new column to track the last update time
  assignedTo INT DEFAULT NULL, 
  FOREIGN KEY (createdBy) REFERENCES users(id), -- Assuming 'users' is the table storing user information
  FOREIGN KEY (assignedTo) REFERENCES users(id),
  FOREIGN KEY (updatedBy) REFERENCES users(id), -- Add foreign key relationship for the updatedBy field
  INDEX idx_created_by (createdBy), -- Create an index on createdBy column
  INDEX idx_assigned_to (assignedTo) -- Create an index on assignedTo column for better performance
);

-- Create the task_history table
CREATE TABLE IF NOT EXISTS task_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  taskId INT NOT NULL,
  field VARCHAR(50) NOT NULL,
  oldValue VARCHAR(255),
  newValue VARCHAR(255),
  changedBy INT NOT NULL, -- Change the data type to INT to store the userId
  changedAt DATETIME NOT NULL,
  message VARCHAR(255) NOT NULL, -- Add a new column to store the message
  FOREIGN KEY (taskId) REFERENCES tasks(id),
  FOREIGN KEY (changedBy) REFERENCES users(id), -- Add foreign key relationship with the users table
  INDEX idx_task_id (taskId),
  INDEX idx_changed_at (changedAt)
);