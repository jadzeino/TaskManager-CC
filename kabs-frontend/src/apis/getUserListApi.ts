const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
export async function getUsersList() {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) {
        throw new Error('Failed to fetch user list');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user list:', error);
      throw error;
    }
  }