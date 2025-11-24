import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';

// Reconstruct __dirname because ES modules do not have it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the main YAML (OpenAPI root document)
const swaggerDocument = YAML.load(
  path.join(__dirname, '../docs/openapi.yaml')
);

// Export so server.js can use it
export { swaggerDocument, swaggerUi };
