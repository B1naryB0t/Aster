import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import routes from './app.js'; // <-- this now imports a clean router

const app = express();

app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());

// Health check route for deployment platforms
app.get('/', (req, res) => {
	res.json({ status: 'OK', message: 'Task API is running' });
});

app.get('/health', (req, res) => {
	res.json({ status: 'OK' });
});

app.use('/api', routes);

app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(err.status || 500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
