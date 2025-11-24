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

app.listen(3000, () => {
    console.log('Server running on port 3000');
    console.log('Swagger UI → http://localhost:3000/api-docs');
});

