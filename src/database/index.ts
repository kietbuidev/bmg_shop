import {Sequelize} from 'sequelize-typescript';
import {logger} from '../utils/logger';
import Category from './models/category';
import Contact from './models/contact';
import Order from './models/order';
import Product from './models/product';
import Post from './models/post';
import OrderItem from './models/order_item';
import Customer from './models/customer';
import Counter from './models/counter';
import User from './models/user';
import Notification from './models/notification';

const database = process.env.DB_NAME || 'neondb';
const username = process.env.DB_USER || 'neondb_owner';
const password = process.env.DB_PASSWORD || 'npg_oUs8lLVi1cWv';
const host = process.env.DB_HOST || 'ep-silent-mode-a1zbfikm-pooler.ap-southeast-1.aws.neon.tech';
const port = Number(process.env.DB_PORT || 5432);
const enableLogging = process.env.DB_LOGGING === 'true';
const ssl = process.env.DB_SSL || 'true'

const sequelize = new Sequelize({
  database,
  username,
  password,
  host,
  port,
  dialect: 'postgres',
  logging: enableLogging ? (msg) => logger.debug(msg) : false,
  models: [Category, Contact, Order, Product, Post, Customer, OrderItem, Counter, User, Notification],
  dialectOptions:
    ssl === 'true'
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : undefined,
  define: {
    underscored: true,
  },
});

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export const connectDatabase = async (): Promise<void> => {
  const maxRetries = Number(process.env.DB_CONNECT_RETRIES ?? 5);
  const retryDelayMs = Number(process.env.DB_CONNECT_RETRY_DELAY_MS ?? 5000);

  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    try {
      await sequelize.authenticate();
      logger.info('Database connection established');
      return;
    } catch (error) {
      const isLastAttempt = attempt === maxRetries;
      logger.error(`Unable to connect to the database (attempt ${attempt}/${maxRetries})`, error as Error);

      if (isLastAttempt) {
        throw error;
      }

      logger.warn(`Retrying database connection in ${retryDelayMs}ms...`);
      await sleep(retryDelayMs);
    }
  }
};

export default sequelize;
