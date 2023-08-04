import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, Grid } from '@mui/material';
import { AddCircleOutline, ExitToApp } from '@mui/icons-material';
import { useUserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { CreateTask, Task } from '../types/TaskType';
import TaskColumn from '../component/TaskColumn';
import { STATUSES } from '../constants';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CreateTaskForm from '../component/CreateTaskForm';
import { getTasks } from '../apis/getTasksApi';
import { createTaskApi } from '../apis/createTaskApi';

function DashboardPage() {
  const { logout,user } = useUserContext();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isCreateTaskFormOpen, setIsCreateTaskFormOpen] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const tasksData = await getTasks()
      setTasks(tasksData);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } 
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateUser = () => {
    navigate('/create-user');
  };

  const updateTaskStatus = (taskId: number, newStatus: string) => {
    setTasks((prevTasks:Task[]) =>
    prevTasks.map((task) =>
      task.id === taskId ? { ...task, status: newStatus } : task
    )
  )
  };
  const updateTasks = (upatedTask: Task) => {
    setTasks((prevTasks:Task[]) =>
    prevTasks.map((task) =>
      task.id === upatedTask.id ? upatedTask : task
    )
  )
  };

  const handleOpenCreateTaskForm = () => {
    setIsCreateTaskFormOpen(true);
  };
  const handleCloseCreateTaskForm = () => {
    setIsCreateTaskFormOpen(false);
  };

  const handleCreateTask = async(newTask: CreateTask) => {
    try {
      const data = await createTaskApi(newTask)
      setTasks([...tasks, data]);
      setIsCreateTaskFormOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
    
  };


  const handleAssignTask = (taskId: number, selectedUser: string) => {
    setTasks((prevTasks: Task[]) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, assignedToName: selectedUser } : task
      )
    );
  };

  // Organize tasks into separate arrays based on their status
  const statusToTasksMap: Record<string, Task[]> = {};
  tasks.forEach((task) => {
    const { status } = task;
    if (!statusToTasksMap[status]) {
      statusToTasksMap[status] = [];
    }
    statusToTasksMap[status].push(task);
  });

  return (
    <div>
      {/* Navbar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Button disabled={user ? false : true } color="inherit" startIcon={<AddCircleOutline />} onClick={handleOpenCreateTaskForm}>
            Create Task
          </Button>
          <Button color="inherit" startIcon={<AddCircleOutline />} onClick={handleCreateUser}>
            Create User
          </Button>
          <Button color="inherit" startIcon={<ExitToApp />} onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    
      {/* Dashboard Content */}
      <Container maxWidth="lg">
        <Box mt={4}>
          {/* Display each column with its tasks */}
          <Grid container spacing={2}>
          <DndProvider backend={HTML5Backend}>
            {STATUSES.map((status) => (
              <Grid item xs={12} sm={6} md={4} lg={2} key={status}>
                <TaskColumn status={status} tasks={tasks.filter((task:Task) => task.status === status)} updateTaskStatus={updateTaskStatus} updateTasks={updateTasks} handleAssignTask={handleAssignTask} updatedBy={user ? parseInt(user.id, 10) : 0}/>
              </Grid>
            ))}
          </DndProvider>
          </Grid>
        </Box>
      </Container>

      {isCreateTaskFormOpen && (
        <CreateTaskForm
          open={isCreateTaskFormOpen}
          onClose={handleCloseCreateTaskForm}
          onCreateTask={handleCreateTask}
          currentUserId={user ? parseInt(user.id, 10) : 0}
        />
      )}
    </div>
  );
}

export default DashboardPage;
