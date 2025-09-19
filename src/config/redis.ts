import {Redis} from 'ioredis';
import {Service} from 'typedi';

@Service()
export class RedisClient {
  private redisClient: Redis;

  constructor() {
    const host = process.env.REDIS_HOST || '127.0.0.1';
    const port = Number(process.env.REDIS_PORT || 6379);
    const password = process.env.REDIS_PASSWORD;

    const redisOptions = {
      host,
      port,
      password,
      retryStrategy(times) {
        return Math.min(times * 50, 2000);
      },
    };

    this.redisClient = new Redis(redisOptions);
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.redisClient.on('connect', () => {
        console.log('Connected to Redis');
        resolve();
      });

      this.redisClient.on('error', (err) => {
        console.error('Error connecting to Redis:', err);
        reject(err);
      });
    });
  }

  getRedisClient(): Redis {
    return this.redisClient;
  }
}
