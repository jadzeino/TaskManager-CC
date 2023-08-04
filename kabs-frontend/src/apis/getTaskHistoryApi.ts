const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
export async function getTaskHistories(taskId: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/history`);
    if (!response.ok) {
      throw new Error('Failed to fetch task history data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching task history:', error);
    throw error;
  }
};
