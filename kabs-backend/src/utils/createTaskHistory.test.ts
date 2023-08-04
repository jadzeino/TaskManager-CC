import { createTaskHistory } from './helper';
import { pool } from "../db/database";
import { fetchUserById } from './dbUtils';

// Mock pool.query function
jest.mock('../db/database', () => ({
  pool: {
    query: jest.fn(),
  },
}));

jest.mock('./dbUtils', () => ({
  fetchUserById: jest.fn(),
}));

describe('createTaskHistory', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create task history with correct parameters', async () => {
    const taskId = 1;
    const field = 'status';
    const oldValue = 'ToDo';
    const newValue = 'InProgress';
    const changedBy = 5;
    const action = 'changed task status from ToDo to InProgress';

    const changedAt = '2023-08-01T22:52:07.720Z';

    
    // Mock the fetchUserById function
    (fetchUserById as jest.Mock).mockResolvedValueOnce({ id: 5, name: 'User 5',email:'azeno@gmail.com' });

    // Mock the pool.query function
    (pool.query as jest.Mock).mockResolvedValueOnce({ affectedRows: 1 });

    await createTaskHistory(taskId, field, oldValue, newValue, changedBy,changedAt, action);

    // Check if fetchUserById was called with the correct parameters
    expect(fetchUserById).toHaveBeenCalledWith(changedBy);

    // Check if pool.query was called with the correct parameters
    expect(pool.query).toHaveBeenCalledWith(
      'INSERT INTO task_history (taskId, field, oldValue, newValue, changedBy, changedAt, message) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [taskId, field, oldValue, newValue, changedBy,changedAt, `User "User 5" ${action} at "${changedAt}"`]
    );
  });

  it('should handle the case when user does not exist', async () => {
    const taskId = 1;
    const field = 'status';
    const oldValue = 'ToDo';
    const newValue = 'InProgress';
    const changedBy = 5;
    const action = 'changed task status from ToDo to InProgress';
    const changedAt = '2023-08-01T22:52:07.720Z'; // Static changedAt value

    // Mock the fetchUserById function to return undefined
    (fetchUserById as jest.Mock).mockResolvedValueOnce(undefined);

    // Spy on console.error to track its calls
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Call the function
    await createTaskHistory(taskId, field, oldValue, newValue, changedBy, changedAt, action);

    // Check if fetchUserById was called with the correct parameters
    expect(fetchUserById).toHaveBeenCalledWith(changedBy);

    // Check if pool.query was not called
    expect(pool.query).not.toHaveBeenCalled();

    // Check if error was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith(`User with userId ${changedBy} not found`);
  });

  it('should handle error when creating task history', async () => {
    const taskId = 1;
    const field = 'status';
    const oldValue = 'ToDo';
    const newValue = 'InProgress';
    const changedBy = 5;
    const action = 'changed task status from ToDo to InProgress';
    const changedAt = '2023-08-01T22:52:07.720Z'; // Static changedAt value

    // Mock the fetchUserById function
    (fetchUserById as jest.Mock).mockResolvedValueOnce({ id: 5, name: 'User 5', email: 'azeno@gmail.com' });

    // Mock the pool.query function to throw an error
    (pool.query as jest.Mock).mockRejectedValueOnce(new Error('Mocked error'));

    // Spy on console.error to track its calls
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Call the function
    await createTaskHistory(taskId, field, oldValue, newValue, changedBy, changedAt, action);

    // Check if fetchUserById was called with the correct parameters
    expect(fetchUserById).toHaveBeenCalledWith(changedBy);

    // Check if pool.query was called with the correct parameters
    expect(pool.query).toHaveBeenCalledWith(
      'INSERT INTO task_history (taskId, field, oldValue, newValue, changedBy, changedAt, message) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [taskId, field, oldValue, newValue, changedBy, changedAt, `User "User 5" ${action} at "${changedAt}"`]
    );

    // Check if error was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error creating task history:', expect.any(Error));
  });
});
