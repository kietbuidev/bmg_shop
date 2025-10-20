import { existsSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logFormat = winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`);

const ensureDir = (dir: string): boolean => {
  try {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    return true;
  } catch (error) {
    console.warn(`Logger: unable to access ${dir}. Skipping.`, error);
    return false;
  }
};

const candidateDirs: string[] = [];

// 1. Cho phép override qua env
if (process.env.LOG_DIR) candidateDirs.push(resolve(process.env.LOG_DIR));

// 2. Mặc định tốt nhất trong container
candidateDirs.push('/app/logs');

// 3. Luôn ghi được trên mọi PaaS
candidateDirs.push('/tmp/bmg-logs');

// 4. Cuối cùng mới fallback vào ../logs
candidateDirs.push(resolve(__dirname, '../logs'));

const logDir = candidateDirs.find((dir) => ensureDir(dir));

const buildFileTransport = (level: 'debug' | 'error'): DailyRotateFile | null => {
  if (!logDir) return null;
  return new DailyRotateFile({
    level,
    datePattern: 'YYYY-MM-DD',
    dirname: join(logDir, level),
    filename: '%DATE%.log',
    maxFiles: 30,
    handleExceptions: level === 'error',
    json: false,
    zippedArchive: true,
  });
};

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.colorize(),
      winston.format.splat(),
      logFormat
    ),
  }),
];

const debugTransport = buildFileTransport('debug');
const errorTransport = buildFileTransport('error');

if (debugTransport) transports.push(debugTransport);
if (errorTransport) transports.push(errorTransport);

const logger = winston.createLogger({
  exitOnError: false, // Không để crash app vì lỗi log
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.splat(),
    logFormat
  ),
  transports,
});

const stream = {
  write: (message: string) => {
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  },
};

export { logger, stream };