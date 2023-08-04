/* eslint-disable testing-library/no-node-access */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CreateTaskForm from './CreateTaskForm';

describe('CreateTaskForm', () => {
  const onCloseMock = jest.fn();
  const onCreateTaskMock = jest.fn();

  beforeEach(() => {
    onCloseMock.mockClear();
    onCreateTaskMock.mockClear();
  });

  it('should render correctly', () => {
    render(
      <CreateTaskForm open={true} onClose={onCloseMock} onCreateTask={onCreateTaskMock} />
    );

    const titleInput = screen.getByTestId('title-text-field').querySelector('input') as HTMLInputElement;
    expect(titleInput).toBeInTheDocument();
    
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
  });

  it('should show error messages for empty title and description fields', async() => {
    render(
      <CreateTaskForm open={true} onClose={onCloseMock} onCreateTask={onCreateTaskMock} />
    );

    // Initially, the error messages should not be visible
    expect(screen.queryByText('Title is required')).not.toBeInTheDocument();
    expect(screen.queryByText('Description is required')).not.toBeInTheDocument();

    const createButton = screen.getByRole('button', { name: 'Create' });

    // Click the Create button without filling the form
    fireEvent.click(createButton);

    // Error messages should be visible
    const titleErrors = await screen.findAllByText('Title is required')
    expect(titleErrors[0]).toBeInTheDocument();
    expect(onCreateTaskMock).not.toHaveBeenCalled();
  });

  it.skip('should call onCreateTask with the correct task data when the form is submitted', () => {
    render(
      <CreateTaskForm open={true} onClose={onCloseMock} onCreateTask={onCreateTaskMock} />
    );
    const titleInput = screen.getByTestId('title-text-field').querySelector('input') as HTMLInputElement;
    const descriptionInput = screen.getByTestId('descr-text-field').querySelector('input') as HTMLInputElement;
    const createButton = screen.getByRole('button', { name: 'Create' });

    // Fill the form with task data
    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'This is a test task' } });

    // Submit the form
    fireEvent.click(createButton);

    // Check if onCreateTask is called with the correct task data
    expect(onCreateTaskMock).toHaveBeenCalledTimes(1);
    expect(onCreateTaskMock).toHaveBeenCalledWith({
      title: 'Test Task',
      description: 'This is a test task',
      createdBy: 0,
      status: 'ToDo',
    });

    // Form fields should be reset after form submission
    expect(titleInput.value).toBe('');
    expect(descriptionInput.value).toBe('');

    // The dialog should be closed after form submission
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('should close the dialog when the Cancel button is clicked', () => {
    render(
      <CreateTaskForm open={true} onClose={onCloseMock} onCreateTask={onCreateTaskMock} />
    );

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });

    // Click the Cancel button
    fireEvent.click(cancelButton);

    // The dialog should be closed
    expect(onCloseMock).toHaveBeenCalledTimes(1);
    // onCreateTask should not be called when Cancel is clicked
    expect(onCreateTaskMock).not.toHaveBeenCalled();
  });
});
