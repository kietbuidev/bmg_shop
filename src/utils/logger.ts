import {existsSync, mkdirSync} from 'fs';
import {join, resolve} from 'path';
import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';

const logFormat = winston.format.printf(({timestamp, level, message}) => `${timestamp} ${level}: ${message}`);

const ensureDir = (dir: string): boolean => {
  try {
    if (!existsSync(dir)) {
      mkdirSync(dir, {recursive: true});
    }
    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`Logger: unable to access ${dir}. Skipping.`, error);
    return false;
  }
};

const candidateDirs: string[] = [];

if (process.env.LOG_DIR) {
  candidateDirs.push(resolve(process.env.LOG_DIR));
}

candidateDirs.push(resolve(__dirname, '../logs'));
candidateDirs.push('/tmp/bmg-logs');

const logDir = candidateDirs.find((dir) => ensureDir(dir));

const buildFileTransport = (level: 'debug' | 'error'): winstonDaily | null => {
  if (!logDir) {
    return null;
  }

  return new winstonDaily({
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
    format: winston.format.combine(winston.format.colorize(), winston.format.splat(), logFormat),
  }),
];

const debugTransport = buildFileTransport('debug');
const errorTransport = buildFileTransport('error');

if (debugTransport) {
  transports.push(debugTransport);
}

if (errorTransport) {
  transports.push(errorTransport);
}

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
  transports,
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

export {logger, stream};
