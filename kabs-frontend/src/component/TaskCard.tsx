import React from 'react';
import { Box, Card, CardContent, IconButton, Typography } from '@mui/material';
import { Task } from '../types/TaskType';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from '@mui/icons-material/History';

import { useTaskActionsContext } from '../context/TaskActionsContext';

const TaskCard = ({ task }: { task: Task}) => {
  const { dispatchEditForm, dispatchAssignForm, dispatchHistory } = useTaskActionsContext();

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('text/plain', JSON.stringify(task));
      };
    
      const handleDrop = (e: React.DragEvent) => {
        console.log('TaskCard: Dropped');
        e.preventDefault();
      };

  return (
    <Card
      sx={{
        marginBottom: 2,
        backgroundColor: '#f5f5f5',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        borderRadius: 1,
        cursor: 'pointer',
      }}
      draggable
      onDragStart={handleDragStart}
      /* onDrop={handleDrop} */
      onDragOver={(e) => e.preventDefault()}
    >
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'space-between', alignItems: 'center' }}>
            <IconButton onClick={() => dispatchHistory(task)}>
                <HistoryIcon />
            </IconButton>
            <IconButton onClick={() => dispatchAssignForm(task)}>
                <PersonIcon />
            </IconButton>
             <IconButton onClick={() => dispatchEditForm(task)}>
                <EditIcon />
            </IconButton>
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {task.title}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {task.assignedToName || 'unAssigned'}
        </Typography>
        <Typography variant="body2" sx={{ marginTop: 1 }}>
          {task.description}
        </Typography>
        <Typography variant="body2" sx={{ marginTop: 2, backgroundColor: '#e0e0e0', borderRadius: 1, padding: 1 }}>
          Status: {task.status}
        </Typography>
        
      </CardContent>
    </Card>
  );
};

export default TaskCard;
