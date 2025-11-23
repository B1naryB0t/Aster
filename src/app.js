import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import authRoutes from './routes/auth.js';
import taskRoutes from '../routes/tasks.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// Health check route
app.get('/health', (req, res) => {
	res.json({ status: 'OK' });
});

// 404 Handler (AFTER ROUTES)
app.use((req, res, next) => {
	const error = new Error('Not Found');
	error.status = 404;
	next(error);
});

// Global Error Handler
app.use(errorHandler);

export default app;
