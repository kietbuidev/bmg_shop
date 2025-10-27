import {Express} from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import parameters from '../schemas/parameters';
require('dotenv').config();

const VERSION = process.env.VERSION || '';
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'REST API Docs',
      version: '2.0.0',
    },
    // servers: [
    //   {
    //     url: `http://103.216.119.121:${process.env.PORT || 5000}`,
    //     description: 'API Server BMG Shop',
    //   },
    // ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      parameters: parameters,
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [path.join(__dirname, '../routes/**/*.{ts,js}'), path.join(__dirname, '../schemas/**/*.{ts,js}')],
};

const swaggerSpec = swaggerJsdoc(options);
function swaggerDocs(app: Express) {
  // Swagger page
  app.use(`/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  // app.get("/docs.json", (req: Request, res: Response) => {
  //   res.setHeader("Content-Type", "application/json");
  //   res.send(swaggerSpec);
  // });
}

export default swaggerDocs;
