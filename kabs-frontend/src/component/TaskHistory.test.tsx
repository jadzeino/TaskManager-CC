/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import TaskHistory from './TaskHistory';
import { getTaskHistories } from '../apis/getTaskHistoryApi';

jest.mock('../apis/getTaskHistoryApi');

describe('TaskHistory', () => {
  const onCloseMock = jest.fn();

  const task = {
    id: 1,
    title: 'Test Task',
    description: 'This is a test task',
    status: 'ToDo', 
    createdAt: '2023-08-03T12:34:56'
    };

    const mockTaskHistories = [
        {
          id: 1,
          taskId: 1,
          field: 'status',
          oldValue: 'Pending',
          newValue: 'Completed',
          changedBy: 1,
          changedAt: '2023-08-04T12:34:56',
          message: 'Task status changed to Completed'
        }
      ];  

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render task history dialog correctly', async () => {

    (getTaskHistories as jest.Mock).mockResolvedValue(mockTaskHistories);

    render(<TaskHistory onClose={onCloseMock} task={task} />);

    expect(screen.getByText('Task History')).toBeInTheDocument();
    expect(screen.getByText(`Title: ${task.title}`)).toBeInTheDocument();
    expect(screen.getByText(`Description: ${task.description}`)).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
      mockTaskHistories.forEach((history) => {
        expect(screen.getByText(history.message)).toBeInTheDocument();
        expect(screen.getByText(`Changed at: ${history.changedAt}`)).toBeInTheDocument();
      });
    });
  });

  it('should handle API fetch error', async () => {

    const errorMessage = 'Failed to fetch task history data';
    (getTaskHistories as jest.Mock).mockRejectedValue(new Error(errorMessage));

    render(<TaskHistory onClose={onCloseMock} task={task} />);

    expect(screen.getByText('Task History')).toBeInTheDocument();
    expect(screen.getByText(`Title: ${task.title}`)).toBeInTheDocument();
    expect(screen.getByText(`Description: ${task.description}`)).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        const errorAlert = screen.getByRole('alert');
        expect(errorAlert).toBeInTheDocument();
        expect(errorAlert.querySelector('.MuiAlert-message')?.textContent).toContain(errorMessage);
    });
  });

  it('should not make an API call if task history is already fetched', async () => {

    (getTaskHistories as jest.Mock).mockResolvedValue(mockTaskHistories);

    render(<TaskHistory onClose={onCloseMock} task={task} />);

    expect(screen.getByText('Task History')).toBeInTheDocument();
    expect(screen.getByText(`Title: ${task.title}`)).toBeInTheDocument();
    expect(screen.getByText(`Description: ${task.description}`)).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      expect(screen.queryByText('Failed to fetch task history data')).not.toBeInTheDocument();
      mockTaskHistories.forEach((history) => {
        expect(screen.getByText(history.message)).toBeInTheDocument();
        expect(screen.getByText(`Changed at: ${history.changedAt}`)).toBeInTheDocument();
      });
    });

    onCloseMock();

    // Open the dialog again to ensure that API call is not made
    render(<TaskHistory onClose={onCloseMock} task={task} />);

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
  });
});
