import {Sequelize} from 'sequelize-typescript';
import {logger} from '../utils/logger';
import Category from './models/category';
import Contact from './models/contact';
import Language from './models/language';
import Media from './models/media';
import Order from './models/order';
import Product from './models/product';
import OrderItem from './models/order_item';
import Customer from './models/customer';
import Counter from './models/counter';

const database = process.env.DB_NAME || 'postgres';
const username = process.env.DB_USER || 'postgres';
const password = process.env.DB_PASSWORD ?? process.env.DB_PASS ?? '';
const host = process.env.DB_HOST || '127.0.0.1';
const port = Number(process.env.DB_PORT || 5432);
const enableLogging = process.env.DB_LOGGING === 'true';

const sequelize = new Sequelize({
  database,
  username,
  password,
  host,
  port,
  dialect: 'postgres',
  logging: enableLogging ? (msg) => logger.debug(msg) : false,
  models: [Category, Contact, Language, Media, Order, Product, Customer, OrderItem, Counter],
  dialectOptions:
    process.env.DB_SSL === 'true'
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

export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established');
  } catch (error) {
    logger.error('Unable to connect to the database', error);
    throw error;
  }
};

export default sequelize;
