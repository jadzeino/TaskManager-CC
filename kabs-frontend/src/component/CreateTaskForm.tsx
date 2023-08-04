import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { CreateTask } from '../types/TaskType';


type CreateTaskFormProps = {
  open: boolean;
  onClose: () => void;
  onCreateTask: (task: CreateTask) => void;
  currentUserId?: number;
};

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({
  open,
  onClose,
  onCreateTask,
  currentUserId,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleCreateTask = async () => {
    // Form validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!description.trim()) {
      setError('Description is required');
      return;
    }

    // Create the task object with the entered data
    const newTask: CreateTask = {
      title,
      description,
      createdBy: currentUserId ? currentUserId : 0,
      status: 'ToDo', // Set the default status for a newly created task
    };

    // Call the onCreateTask function with the new task object
    onCreateTask(newTask);

    // Reset the form fields
    setTitle('');
    setDescription('');
    setError('');

    onClose();
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Task</DialogTitle>
      <DialogContent>
       <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            data-testid={"title-text-field"}
            autoFocus
            required
            error={Boolean(error)}
            helperText={error}
          />
          <TextField
            label="Description"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            data-testid={"descr-text-field"}
            multiline
            rows={4}
            margin="normal"
            required
            error={Boolean(error)}
            helperText={error}
          />
        
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleCreateTask} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTaskForm;
