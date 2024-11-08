// File: node_app/src/config/swagger.ts

import swaggerJsdoc from 'swagger-jsdoc';
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo API Documentation',
      version: '1.0.0',
      description: 'API documentation for Todo application',
      contact: {
        name: 'Pacifique',
        email: 'tuyipaccy78@gmail.com',
      },
      license: {
        name: 'Apache 2.0',
        url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
      },
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:5001',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: <token>',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'User ID',
            },
            name: {
              type: 'string',
              description: 'User full name',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp',
            },
          },
        },
        Todo: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Todo ID',
            },
            title: {
              type: 'string',
              description: 'Todo title',
            },
            description: {
              type: 'string',
              description: 'Todo description',
            },
            completed: {
              type: 'boolean',
              description: 'Todo completion status',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

const swaggerRouter = Router();
swaggerRouter.use('/docs', swaggerUi.serve);
swaggerRouter.get('/docs', swaggerUi.setup(specs, { explorer: true }));

export { swaggerRouter, specs };