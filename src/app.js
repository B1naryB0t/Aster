import express from 'express';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import taskRoutes from './routes/tasks.js';
import categoryRoutes from './routes/categories.js';
import tagRoutes from './routes/tags.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/tasks', taskRoutes);
router.use('/categories', categoryRoutes);
router.use('/tags', tagRoutes);

router.get('/health', (req, res) => {
	res.json({ status: 'OK' });
});

export default router;
