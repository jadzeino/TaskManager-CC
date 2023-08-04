const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
export const getTasks = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`);
    if (!response.ok) {
      throw new Error('Failed to fetch task data');
    }
    const data = await response.json();
    console.log('data ', data);
    return data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};