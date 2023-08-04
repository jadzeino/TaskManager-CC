const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
export async function loginUserApi(email: string, password: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        throw new Error('Login failed. Please check your credentials.');
      }
  
      const userFromServer = await response.json();
      return {
        id: userFromServer.userId,
        username: userFromServer.name,
      };
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }