import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
	getTasks,
	getTaskById,
	createTask,
	updateTask,
	deleteTask,
	getUserTasks,
} from '../controllers/taskController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getTasks);
router.post('/', createTask);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.get('/user/:userId/tasks', getUserTasks);

export default router;
