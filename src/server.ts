// service.ts
import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import swaggerDocs from './utils/swagger';
import routes from './routes';
import errorMiddleware from './middleware/error';
import { NotFoundError } from './utils/customError';
import { logger, stream } from './utils/logger';
import { connectDatabase } from './database';

require('dotenv').config();

const PORT = Number(process.env.PORT) || 8000;
const NODE_ENV = process.env.ENVIRONMENT || 'production';
const LOG_FORMAT = process.env.LOG_FORMAT || 'short';

const app = express();
const server = http.createServer(app);

// ---------- Middlewares cơ bản ----------
app.set('trust proxy', true);
app.use(cors({ origin: true, credentials: true }));
app.use(helmet());
app.use(morgan(LOG_FORMAT, { stream }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ---------- Routes ----------
app.get(`/api/`, (_req, res) => res.status(200).send('Congratulations! API is working!'));
app.use(`/api`, routes);

// ---------- Swagger ----------
swaggerDocs(app);

// ---------- 404 + Error handler ----------
app.use((req: Request, _res: Response, next: NextFunction) => {
  const message = `Route ${req.originalUrl} not found`;
  logger.warn(message);
  next(new NotFoundError(message));
});
app.use(errorMiddleware);

const startServer = () => {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`=================================`);
    console.log(` ENV: ${NODE_ENV}`);
    console.log(` 🚀 App listening on PORT ${PORT}`);
    console.log(`=================================`);
    logger.info(`🚀 App listening on PORT ${PORT}`);

    connectDatabase()
      .then(() => logger.info('✅ Database connection established'))
      .catch((err) => {
        logger.error('❌ Failed to connect DB', err as Error);
      });
  });
};

startServer();


export default app;
