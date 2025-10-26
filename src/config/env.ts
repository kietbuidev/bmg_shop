// src/config/env.ts
import 'dotenv/config';
import { cleanEnv, str, num, bool } from 'envalid';

export const env = cleanEnv(process.env, {
  NODE_ENV:        str({ choices: ['development', 'test', 'production'], default: 'production' }),
  PORT:            num({ default: 3000 }),
  TIMEZONE:        str({ default: 'Asia/Ho_Chi_Minh' }),

  DB_HOST:         str(),
  DB_PORT:         num({ default: 5432 }),
  DB_USER:         str(),
  DB_PASSWORD:     str({ default: '' }),
  DB_NAME:         str(),
  DB_SSL:          bool({ default: false }),
  DB_CONNECT_RETRIES:      num({ default: 10 }),
  DB_CONNECT_RETRY_DELAY_MS: num({ default: 5000 }),

  LOG_DIR:         str({ default: 'logs' }),

  CLOUDINARY_CLOUD_NAME: str({ default: '' }),
  CLOUDINARY_API_KEY:    str({ default: '' }),
  CLOUDINARY_API_SECRET: str({ default: '' }),

  SMTP_HOST:       str({ default: '' }),
  SMTP_PORT:       num({ default: 587 }),
  SMTP_USER:       str({ default: '' }),
  SMTP_PASS:       str({ default: '' }),
  SMTP_ENABLE_SSL: bool({ default: true }),
});