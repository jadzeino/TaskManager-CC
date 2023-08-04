import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { Task } from '../types/TaskType';

type EditTaskFormProps = {
  open: boolean;
  onClose: () => void;
  onUpdateTaskTitleAndDescription: (taskId: number, title: string, description: string) => void;
  task: Task;
};

const EditTaskForm: React.FC<EditTaskFormProps> = ({
  open,
  onClose,
  onUpdateTaskTitleAndDescription,
  task,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Set the initial title and description when the form is opened
    setTitle(task.title);
    setDescription(task.description);
    setError('');
  }, [task]);

  const handleUpdateTask = async () => {
    // Form validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!description.trim()) {
      setError('Description is required');
      return;
    }

    // Check if the form is dirty (changes were made)
    if (title === task.title && description === task.description) {
      setError('No changes made to the task');
      return;
    }

    onUpdateTaskTitleAndDescription(task.id, title, description);

    onClose();
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
        <Button onClick={handleUpdateTask} color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTaskForm;
