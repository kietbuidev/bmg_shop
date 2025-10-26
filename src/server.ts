import 'reflect-metadata';
import cors from 'cors';
import helmet from 'helmet';
import express, {Request, Response, NextFunction} from 'express';
import http from 'http';
import swaggerDocs from './utils/swagger';
import routes from './routes';
import errorMiddleware from './middleware/error';
// import {RedisClient} from './config/redis';
import morgan from 'morgan';
import {logger, stream} from './utils/logger';
import path from 'path';
import {NotFoundError} from './utils/customError';
import {connectDatabase} from './database';

require('dotenv').config();

const VERSION = process.env.VERSION || '';
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'localhost';

const app = express();
const logFormat = process.env.LOG_FORMAT || 'short';

// Add a list of allowed origins.
// If you have more origins you would like to add, you can add them to the array below.
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'https://bmg-admin-shop.vercel.app', '*', 'https://kaylinfashion.vercel.app'];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

// Then pass these options to cors:
app.use(cors(options));
app.use(helmet());
app.use(morgan(logFormat, {stream}));
// app.use(express.json());

// Upload limit Image
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true, limit: '10mb'}));

// GET IP
app.set('trust proxy', true);

// use the static file
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

const httpServer = http.createServer(app);

// Connect to Redis
// const redisInstance = new RedisClient();
// redisInstance.connect().catch((error) => {
//   logger.error(`Redis connection error: ${error}`);
// });

app.get(`${VERSION}/api/`, (req: Request, res: Response) => {
  res.status(200).send('Congratulations! API is working!');
});

app.get(`/api/`, (req: Request, res: Response) => {
  res.status(200).send('Congratulations! API is working!');
});

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/robots.txt', (req, res, next) => {
  const error = new NotFoundError('Access to robots.txt is forbidden');
  next(error);
});

app.use(`${VERSION}/api`, routes);
app.use(`/api`, routes);


swaggerDocs(app);

//Error handler must be last app.use!!
app.use((req: Request, res: Response, next: NextFunction) => {
  const message = `Route ${req.originalUrl} not found`;
  logger.warn(message);
  next(new NotFoundError(message));
});

app.use(errorMiddleware);

const startServer = async () => {
  try {
    await connectDatabase();

    httpServer.listen(PORT, () => {
      console.log(`========== ENV: ${PORT} ============`);
      console.log(`🚀 App listening on the port ${PORT}`);
      console.log(`=================================`);

      logger.info(`=================================`);
      logger.info(`======= ENV: ${NODE_ENV} =======`);
      logger.info(`🚀 App listening on the port ${PORT}`);
      logger.info(`🌐 Server URL: http://localhost:${PORT}`);
      logger.info(`=================================`);
    });
  } catch (error) {
    logger.error('Failed to connect to the database. Shutting down...', error as Error);
    process.exit(1);
  }
};

startServer();
