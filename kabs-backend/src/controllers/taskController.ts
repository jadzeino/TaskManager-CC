import { Request, Response } from 'express';
import { pool } from '../db/database';
import { createTaskHistory, validateTaskStatusTransition } from '../utils/helper';
import { format } from 'date-fns';

export async function createTask(req: Request, res: Response) {
    try {
        const { title, description, createdBy } = req.body;
    
        // Validate the input data
        if (!title || !description || !createdBy) {
          return res.status(400).json({ message: 'Missing required fields' });
        }
    
        // Insert the new task into the database
        const [result] = await pool.query(
          'INSERT INTO tasks (title, description, status, createdBy, createdAt) VALUES (?, ?, ?, ?, NOW())',
          [title, description, 'ToDo', createdBy]
        );
    
        // Extract the insertId from the ResultSetHeader
        const taskId = (result as any).insertId;

        // Record task history for task creation
        const action = `created this Task at`;
        const updateAt = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        await createTaskHistory(taskId, 'title', '', title, createdBy,updateAt, action);
        await createTaskHistory(taskId, 'description', '', description, createdBy,updateAt, action);
    
        return res.status(201).json({ id: taskId, title, description, status: 'ToDo', createdBy, createdAt: new Date() });
      } catch (error) {
        console.error('Error creating task:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
  }
  
  export async function updateTaskStatus(req: Request, res: Response) {
    try {
      const { taskId } = req.params;
      const { status, updatedBy } = req.body;
  
      // Validate the input data
      if (!status || !['ToDo', 'InProgress', 'Blocked', 'InQA', 'Done', 'Deployed'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
  
      // Check if the task with the given ID exists
      const [taskRows]:any = await pool.query('SELECT * FROM tasks WHERE id = ?', [taskId]);
      console.log("taskRows  ",taskRows)
      const task = taskRows[0];
      
  
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
    
      const currentStatus = task.status;
      console.log("currentStatus  ",currentStatus)
      // Validate the status transition
      validateTaskStatusTransition(currentStatus, status);
      // Update the status of the task in the database
      await pool.query('UPDATE tasks SET status = ?, updatedBy = ?, updatedAt = NOW() WHERE id = ?', [status, updatedBy, taskId]);

      const action = `changed Task status from "${task.status}" to "${status}"`;
      const updateAt = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      await createTaskHistory(taskId as any, 'status', task.status, status, updatedBy,updateAt, action);
  
      return res.status(200).json({ message: 'Task status updated successfully' });
    } catch (error) {
      console.error('Error updating task status:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  
  export async function updateTaskTitleAndDescription(req: Request, res: Response) {
    try {
      const { taskId } = req.params;
      const { title, description, updatedBy } = req.body;
  
      // Validate the input data
      if (!title || !description) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      // Check if the task with the given ID exists
      const [taskRows]:any = await pool.query('SELECT * FROM tasks WHERE id = ?', [taskId]);
      console.log("result  ",taskRows)
      const task = taskRows[0];
  
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      // Check if the title has changed
     if (title !== task.title) {
        const action = `changed Task title from "${task.title}" to "${title}"`;
        const updateAt = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        await createTaskHistory(taskId as any, 'title', task.title, title, updatedBy,updateAt, action);
    }
    // Check if the description has changed
    if (description !== task.description) {
        const action = `changed Task description from "${task.description}" to "${description}"`;
        const updateAt = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        await createTaskHistory(taskId as any, 'description', task.description, description, updatedBy,updateAt, action);
    } 
  
      // Update the title and description of the task in the database
      await pool.query('UPDATE tasks SET title = ?, description = ?, updatedBy = ?, updatedAt = NOW() WHERE id = ?', [title, description, updatedBy, taskId]);
  
      return res.status(200).json({ message: 'Task title and description updated successfully' });
    } catch (error) {
      console.error('Error updating task title and description:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  export async function assignTask(req: Request, res: Response) {
    try {
      const { taskId, userId } = req.params;
      const { updatedBy,assignedUserName } = req.body;

      const targetUserId:any= userId==="unAssigned" ? null : userId
  
      // Check if the task with the given ID exists
      const [taskRows]:any = await pool.query('SELECT * FROM tasks WHERE id = ?', [taskId]);
      const task = taskRows[0];
  
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      // Check if the assigned user has changed
        if (targetUserId !== task.assignedTo) {
        const action = `assigned this Task to "${assignedUserName}"`;
        const updateAt = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        await createTaskHistory(taskId as any, 'assignedTo', task.assignedTo, targetUserId, updatedBy,updateAt, action);
        }
  
      // Update the task's assigned user in the database
      await pool.query('UPDATE tasks SET assignedTo = ?, updatedBy = ?, updatedAt = NOW() WHERE id = ?', [targetUserId, updatedBy, taskId]);
  
      return res.status(200).json({ message: 'Task assigned successfully' });
    } catch (error) {
      console.error('Error assigning task:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  export async function getAllTasksOld(req: Request, res: Response) {

    try {
        // Fetch all tasks from the database
        const [taskRows] = await pool.query('SELECT * FROM tasks');
    
        // If there are no tasks found, return an empty array
        if (!taskRows) {
          return res.status(200).json([]);
        }
    
        // Return the list of tasks as JSON response
        return res.status(200).json(taskRows);
      } catch (error) {
        console.error('Error fetching all tasks:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
  
  }
  export async function getAllTasks(req: Request, res: Response) {
    try {
      // Fetch all tasks from the database along with the assigned user's name
      const query = `
        SELECT 
          tasks.id,
          tasks.title,
          tasks.description,
          tasks.status,
          tasks.createdBy,
          tasks.updatedBy,
          tasks.createdAt,
          tasks.updatedAt,
          tasks.assignedTo,
          users.name AS assignedToName -- Alias the 'name' column from the 'users' table to 'assignedToName'
        FROM
          tasks
        LEFT JOIN
          users ON tasks.assignedTo = users.id;
      `;
      const [taskRows] = await pool.query(query);
  
      // If there are no tasks found, return an empty array
      if (!taskRows) {
        return res.status(200).json([]);
      }
  
      // Return the list of tasks as JSON response
      return res.status(200).json(taskRows);
    } catch (error) {
      console.error('Error fetching all tasks:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  export async function getTaskHistory(req: Request, res: Response) {
    try {
      const { taskId } = req.params;
  
      // Check if the task with the given ID exists
      const [taskRows]:any = await pool.query('SELECT * FROM tasks WHERE id = ?', [taskId]);
      const task = taskRows[0]; // Get the first task (if exists)
  
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      // Fetch the history of the task from the database
      const [historyRows] = await pool.query('SELECT * FROM task_history WHERE taskId = ? ORDER BY changedAt DESC', [taskId]);
  
      return res.status(200).json(historyRows);
    } catch (error) {
      console.error('Error fetching task history:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }