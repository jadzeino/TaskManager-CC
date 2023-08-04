import { Router } from 'express';
import {
  createTask,
  updateTaskStatus,
  updateTaskTitleAndDescription,
  assignTask,
  getTaskHistory,
  getAllTasks,
} from '../controllers/taskController';

import {
    createUser,
    updateUser,
    deleteUser,
    getAllUsers,
    getUserById,
    loginUser,
  } from '../controllers/userController';

const router = Router();

router.post('/tasks', createTask);
router.put('/tasks/:taskId/status', updateTaskStatus);
router.put('/tasks/:taskId', updateTaskTitleAndDescription);
router.put('/tasks/:taskId/assign/:userId', assignTask);
router.get('/tasks/:taskId/history', getTaskHistory);
router.get('/tasks', getAllTasks);


router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/login', loginUser);

export default router;