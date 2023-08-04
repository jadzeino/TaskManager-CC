import React, { useEffect, useState, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Task } from '../types/TaskType';
import { getTaskHistories } from '../apis/getTaskHistoryApi';

type TaskHistoryProps = {
  onClose: () => void;
  task: Task;
};

type TaskHistoryType = {
  id: number;
  taskId: number;
  field: string;
  oldValue: string | null;
  newValue: string;
  changedBy: number;
  changedAt: string;
  message: string;
};

const TaskHistory: React.FC<TaskHistoryProps> = ({ onClose, task }) => {
  const [taskHistory, setTaskHistory] = useState<TaskHistoryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const memoizedTaskHistory = useMemo(() => {
    return taskHistory;
  }, [taskHistory]);

  useEffect(() => {
    // Check if task history is already fetched
    if (memoizedTaskHistory.length === 0) {
      // Fetch task history data from the backend API
      fetchTaskHistory(task.id);
    }
  }, [task.id, memoizedTaskHistory]);

  const fetchTaskHistory = async (taskId: number) => {
    setIsLoading(true);
    setError('');

    try {
      const data = await getTaskHistories(taskId)
      setTaskHistory(data);
    } catch (error) {
      console.error('Error fetching task history:', error);
      setError('Failed to fetch task history data');
    } finally {
      setIsLoading(false);
      // Hide the error alert after 3 seconds
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Task History</DialogTitle>
      <DialogContent>
        <Typography variant="h6" gutterBottom>
          Title: {task.title}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Description: {task.description}
        </Typography>
        {isLoading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <List>
            {memoizedTaskHistory.map((history) => (
              <ListItem
                key={history.id}
                sx={{
                  borderRadius: 2,
                  backgroundColor: '#f5f5f5',
                  marginBottom: '12px',
                }}
              >
                <ListItemText primary={history.message} secondary={`Changed at: ${history.changedAt}`} />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TaskHistory;
