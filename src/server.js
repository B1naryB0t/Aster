import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import routes from './app.js'; // This should export a router, not an entire app

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());

// Routes
app.use('/api', routes);

// 404 handler
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// Error handler
app.use((err, req, res, next) => {
	console.error(err.stack);

	if (!err.status) {
		err.status = 500;
		err.message = 'Internal Server Error';
	}

	res.status(err.status).json({ error: err.message });
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
