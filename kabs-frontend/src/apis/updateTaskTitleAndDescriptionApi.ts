const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
export async function updateTaskTitleAndDescription(taskId: number, newTitle: string, newDescription: string,updatedBy:number) {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          updatedBy: updatedBy
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update task title and description');
      }
  
    } catch (error) {
      console.error('Error updating task title and description:', error);
      throw error;
    }
  };