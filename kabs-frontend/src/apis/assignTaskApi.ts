const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export async function assignTask(taskId: number,userId:number|string,updatedBy:number,assignedUserName:string) {
    try {  
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/assign/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          updatedBy: updatedBy,
          assignedUserName: assignedUserName
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to assign task');
        
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error assigning task:', error);
      throw error;
    }

}    
