import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import routes from './app.js'; // <-- this now imports a clean router

const app = express();

app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());
import { swaggerDocument, swaggerUi } from './swagger.js';

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


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

app.listen(3000, () => console.log('Server running on port 3000'));
