import {existsSync, mkdirSync} from 'fs';
import {isAbsolute, join, resolve} from 'path';
import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';

// logs dir
const configuredLogDir = process.env.LOG_DIR || 'src/logs';
const logDir = isAbsolute(configuredLogDir)
  ? configuredLogDir
  : resolve(process.cwd(), configuredLogDir);

if (!existsSync(logDir)) {
  mkdirSync(logDir, {recursive: true});
}

// Define log format
const logFormat = winston.format.printf(({timestamp, level, message}) => `${timestamp} ${level}: ${message}`);

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.splat(),
    logFormat,
  ),
  transports: [
    // debug log setting
    new winstonDaily({
      level: 'debug',
      datePattern: 'YYYY-MM-DD',
      dirname: join(logDir, 'debug'), // log file /logs/debug/*.log in save
      filename: `%DATE%.log`,
      maxFiles: 30, // 30 Days saved
      json: false,
      zippedArchive: true,
    }),
    // error log setting
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: join(logDir, 'error'), // log file /logs/error/*.log in save
      filename: `%DATE%.log`,
      maxFiles: 30, // 30 Days saved
      handleExceptions: true,
      json: false,
      zippedArchive: true,
    }),
    // console log
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.splat(),
        logFormat
      )
    })
  ],
});

// logger.add(
//   new winston.transports.Console({
//     format: winston.format.combine(winston.format.splat(), winston.format.colorize()),
//   }),
// );

const stream = {
  write: (message: string) => {
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  },
};

export function logInfo(message: string, ...args: any[]) {
  console.log(`[INFO] ${new Date().toISOString()} ${message}`, ...args);
}
export function logError(message: string, ...args: any[]) {
  console.error(`[ERROR] ${new Date().toISOString()} ${message}`, ...args);
}

export {logger, stream};
