const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
export async function callUpdateTaskStatus(taskId: number, status: string,updatedBy:number) {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: status,
        updatedBy: updatedBy
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update task status');
    }
    console.log('Task status updated successfully.');
  } catch (error) {
    console.error('Error updating task status:', error);
    throw error;
  }
  };
