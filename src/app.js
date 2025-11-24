import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import taskRoutes from './routes/tasks.js';
import categoryRoutes from './routes/categories.js';
import tagRoutes from './routes/tags.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);
app.use('/categories', categoryRoutes);
app.use('/tags', tagRoutes);

app.get('/health', (req, res) => {
	res.json({ status: 'OK' });
});

app.use(errorHandler);

export default app;
