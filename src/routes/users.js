import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
	getUsers,
	getUserById,
	updateUser,
	updateUserRole,
	deleteUser,
} from '../controllers/userController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.patch('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

export default router;
