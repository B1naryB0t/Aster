import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import routes from './app.js';

const app = express();

app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());

// Health check route for deployment platforms
app.get('/', (req, res) => {
	res.json({ status: 'OK', message: 'To:Do List API is running' });
});

const swaggerDocument = YAML.load('./docs/openapi.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api', routes);

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger UI → http://localhost:${PORT}/api-docs`);
});
