import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
	getTags,
	getTagById,
	createTag,
	updateTag,
	deleteTag,
} from '../controllers/tagController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getTags);
router.post('/', createTag);
router.get('/:id', getTagById);
router.put('/:id', updateTag);
router.delete('/:id', deleteTag);

export default router;
