import React from 'react';
import { Task } from '../types/TaskType';
import { Box, Paper, Typography } from '@mui/material';
import DraggableTaskCard from './DraggableTaskCard';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../constants';
import { isValidateTaskStatusTransition } from '../utils/helpers';
import { callUpdateTaskStatus } from '../apis/updateTaskStatusApi';

type TaskColumnProps = {
    status: string;
    tasks: Task[];
    updateTaskStatus: (taskId: number, newStatus: string) => void;
    updatedBy: number
  };

  const TaskColumn: React.FC<TaskColumnProps> = ({ status, tasks, updateTaskStatus,updatedBy }) => {
// Create a drop target to handle the drop event
const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    drop: (item) => handleDrop(item as any),
  });

  const handleDrop = async({task}: any) => {
    // Check if the changing state is valid
    const isValidTransition = isValidateTaskStatusTransition(task.status, status);
    if (!isValidTransition) {
      console.log('Invalid state change. Dragged item will return to original position.');
      return;
    }

    try {
        await callUpdateTaskStatus(task.id,status,updatedBy)
        updateTaskStatus(task.id, status);
      } catch (error) {
        console.error('Error updating task status:', error);
      }
    
  };

    return (
      <div ref={drop}>
        <Typography variant="h5" component="h2">
          {status}
        </Typography>
        <Box mt={2}>
        
        <Paper /* sx={{
            maxHeight: 'calc(100vh - 200px)',
            overflow: 'auto',
          }} */> 
          {tasks.map((task) => (
            <DraggableTaskCard key={task.id} task={task}/>
          ))}
          </Paper>
        </Box>
      </div>
    );
  };
  
  export default TaskColumn;
