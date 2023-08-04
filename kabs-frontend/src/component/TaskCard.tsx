import React, { useState } from 'react';
import { Box, Card, CardContent, IconButton, Typography } from '@mui/material';
import { Task } from '../types/TaskType';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from '@mui/icons-material/History';
import EditTaskForm from './EditTaskForm';
import AssignTaskForm from './AssignTaskForm';
import TaskHistory from './TaskHistory';
import { useUserContext } from '../context/UserContext';
import { updateTaskTitleAndDescription } from '../apis/updateTaskTitleAndDescriptionApi';

const TaskCard = ({ task, updateTasks,handleAssignTask }: { task: Task,updateTasks:(updatedTask:Task)=>void, handleAssignTask:(taskId:number,selectedUser:string)=>void }) => {

    const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
    const [isAssignTaskOpen, setIsAssignTaskOpen] = useState(false);
    const [isTaskHistoryOpen, setIsTaskHistoryOpen] = useState(false);
    const { user } = useUserContext();

    const handleOpenEditTask = () => {
        setIsEditTaskOpen(true);
    };
  
    const handleCloseEditTask = () => {
        setIsEditTaskOpen(false);
    };

    const handleOpenAssignTask = () => {
        setIsAssignTaskOpen(true);
    };
  
    const handleCloseAssignTask = () => {
        setIsAssignTaskOpen(false);
    };

    const handleOpenTaskHistory = () => {
        setIsTaskHistoryOpen(true);
    };

    const handleCloseTaskHistory = () => {
        setIsTaskHistoryOpen(false);
    };

    

    const handleUpdateTaskTitleAndDescription = async (taskId: number, newTitle: string, newDescription: string) => {
        try {
           await updateTaskTitleAndDescription(taskId,newTitle,newDescription,user ? parseInt(user.id, 10) : 0) 
          
          updateTasks({ ...task, title: newTitle, description: newDescription });
          handleCloseEditTask();
        } catch (error) {
          console.error('Error updating task title and description:', error);
        }
      };

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
            <IconButton onClick={handleOpenTaskHistory}>
                <HistoryIcon />
            </IconButton>
            <IconButton onClick={handleOpenAssignTask}>
                <PersonIcon />
            </IconButton>
             <IconButton onClick={handleOpenEditTask}>
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

      {/* Task actions pop-up */}
      {isEditTaskOpen && <EditTaskForm open={isEditTaskOpen} onClose={handleCloseEditTask} 
      onUpdateTaskTitleAndDescription={handleUpdateTaskTitleAndDescription}
      task={task} />}
      
      {isAssignTaskOpen && <AssignTaskForm onClose={handleCloseAssignTask} 
      handleAssignTask={handleAssignTask}
      task={task}
      updatedBy={user ? parseInt(user.id, 10) : 0} />}

      {isTaskHistoryOpen && <TaskHistory onClose={handleCloseTaskHistory} 
      task={task} />}
    </Card>
  );
};

export default TaskCard;
