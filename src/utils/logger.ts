import { existsSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import type TransportStream from 'winston-transport'; // ✅ kiểu đúng cho transports

const logFormat = winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`);

const ensureDir = (dir: string): boolean => {
  try {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    return true;
  } catch (error) {
    // đổi sang info để đỡ “ồn” khi probe các dir không writable
    console.info(`Logger: can't use ${dir}.`, (error as Error).message);
    return false;
  }
};

const isRunningInContainer =
  existsSync('/.dockerenv') ||
  process.env.CONTAINER === 'true' ||
  process.env.DOCKER_CONTAINER === 'true' ||
  !!process.env.KUBERNETES_SERVICE_HOST;

const candidateDirs: string[] = [];

// 0) Cho phép override qua env
if (process.env.LOG_DIR) candidateDirs.push(resolve(process.env.LOG_DIR));

// 1) Nếu chạy trong container: ưu tiên /app/logs trước tiên ✅
if (isRunningInContainer) candidateDirs.push('/app/logs');

// 2) Khi chạy local: src/logs, rồi dist/logs
const srcLogsDir = resolve(process.cwd(), 'src/logs');
const compiledLogsDir = resolve(__dirname, '../logs');
candidateDirs.push(srcLogsDir);
if (!candidateDirs.includes(compiledLogsDir)) candidateDirs.push(compiledLogsDir);

// 3) Fallback cuối cùng luôn ghi được (Heroku/Render…)
candidateDirs.push('/tmp/bmg-logs');

const logDir = candidateDirs.find((dir) => ensureDir(dir));

const buildFileTransport = (level: 'debug' | 'error'): DailyRotateFile | null => {
  if (!logDir) return null;
  return new DailyRotateFile({
    level,
    datePattern: 'YYYY-MM-DD',
    dirname: join(logDir, level),
    filename: '%DATE%.log',
    maxFiles: '30d',          // có thể dùng '30d' để xoá sau 30 ngày
    handleExceptions: level === 'error',
    zippedArchive: true,
  });
};

const transports: TransportStream[] = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.colorize(),
      winston.format.splat(),
      logFormat
    ),
  }),
];

// Cho phép tắt file logger qua env
const enableFile = (process.env.LOG_TO_FILE ?? 'true').toLowerCase() !== 'false';

if (enableFile) {
  const debugTransport = buildFileTransport('debug');
  const errorTransport = buildFileTransport('error');
  if (debugTransport) transports.push(debugTransport);
  if (errorTransport) transports.push(errorTransport);
}

export const logger = winston.createLogger({
  exitOnError: false,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.splat(),
    logFormat
  ),
  transports,
});

export const stream = {
  write: (message: string) => logger.info(message.replace(/\n$/, '')),
};