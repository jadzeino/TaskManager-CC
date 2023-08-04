import { CreateTask } from "../types/TaskType";
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  export async function createTaskApi(newTask: CreateTask) {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTask),
        });
  
        if (!response.ok) {
          throw new Error('Failed to create task');
        }
  
        const data = await response.json();
        return data
      } catch (error) {
        console.error('Error creating task:', error);
        throw error;
      }
   
  }