import fetchMock from 'jest-fetch-mock';
import { assignTask } from './assignTaskApi';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';


// Mock the fetch function using jest-fetch-mock
fetchMock.enableMocks();

describe('assignTask', () => {
    const taskId = 1;
    const userId = 42;
    const updatedBy = 100;
    const assignedUserName = 'Ahmed Zeno';
  
    afterEach(() => {
      fetchMock.resetMocks();
    });
  
    it.skip('should assign the task and return data', async () => {
        const data = { taskId: 1, assignedTo: userId, updatedBy: updatedBy };
        fetchMock.mockResponseOnce(JSON.stringify(data), { status: 200 });
      
        const result = await assignTask(taskId, userId, updatedBy, assignedUserName);
      
        expect(result).toEqual(data);
        expect(fetchMock).toHaveBeenCalledWith(/*...*/);
      });
  
    it('should throw an error if the API call fails', async () => {
      const errorMessage = 'Failed to assign task';
      fetchMock.mockRejectOnce(new Error(errorMessage));
  
      await expect(assignTask(taskId, userId, updatedBy, assignedUserName)).rejects.toThrow(errorMessage);
      expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/tasks/${taskId}/assign/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          updatedBy: updatedBy,
          assignedUserName: assignedUserName,
        }),
      });
    });
  });