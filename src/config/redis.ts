// import {Redis, RedisOptions} from 'ioredis';
// import {Service} from 'typedi';

// type RedisCallback<T> = (err: Error | null, result: T) => void;

// export interface RedisLike {
//   get(key: string): Promise<string | null>;
//   set(key: string, value: string, mode?: string, duration?: number): Promise<'OK' | null>;
//   keys(pattern: string): Promise<string[]>;
//   del(...keys: string[]): Promise<number>;
//   ttl(key: string, callback?: RedisCallback<number>): Promise<number>;
// }

// class NoopRedis implements RedisLike {
//   private store = new Map<string, {value: string; expiresAt: number | null}>();

//   async get(key: string): Promise<string | null> {
//     const record = this.store.get(key);
//     if (!record) {
//       return null;
//     }

//     if (record.expiresAt && record.expiresAt < Date.now()) {
//       this.store.delete(key);
//       return null;
//     }

//     return record.value;
//   }

//   async set(key: string, value: string, mode?: string, duration?: number): Promise<'OK' | null> {
//     let expiresAt: number | null = null;
//     if (mode === 'EX' && typeof duration === 'number') {
//       expiresAt = Date.now() + duration * 1000;
//     }

//     this.store.set(key, {value, expiresAt});
//     return 'OK';
//   }

//   async keys(pattern: string): Promise<string[]> {
//     const regex = new RegExp('^' + pattern.replace(/[*]/g, '.*') + '$');
//     return Array.from(this.store.keys()).filter((key) => regex.test(key));
//   }

//   async del(...keys: string[]): Promise<number> {
//     let removed = 0;
//     const flatKeys = keys.flat();
//     flatKeys.forEach((key) => {
//       if (this.store.delete(key)) {
//         removed += 1;
//       }
//     });
//     return removed;
//   }

//   async ttl(key: string, callback?: RedisCallback<number>): Promise<number> {
//     const record = this.store.get(key);
//     const ttl = record?.expiresAt ? Math.max(0, Math.floor((record.expiresAt - Date.now()) / 1000)) : -2;
//     if (callback) {
//       callback(null, ttl);
//     }
//     return ttl;
//   }
// }

// @Service()
// export class RedisClient {
//   private redisClient: RedisLike;

//   constructor() {
//     const enabled = (process.env.REDIS_ENABLED || '').toLowerCase() === 'true';

//     if (enabled) {
//       const host = process.env.REDIS_HOST || '127.0.0.1';
//       const port = Number(process.env.REDIS_PORT || 6379);
//       const password = process.env.REDIS_PASSWORD;

//       const redisOptions: RedisOptions = {
//         host,
//         port,
//         password,
//         lazyConnect: true,
//         retryStrategy(times) {
//           return Math.min(times * 50, 2000);
//         },
//       };

//       this.redisClient = new Redis(redisOptions);
//     } else {
//       this.redisClient = new NoopRedis();
//     }
//   }

//   async connect(): Promise<void> {
//     if (this.redisClient instanceof Redis) {
//       return new Promise((resolve, reject) => {
//         this.redisClient.once('ready', () => {
//           console.log('Connected to Redis');
//           resolve();
//         });

//         this.redisClient.once('error', (err) => {
//           console.error('Error connecting to Redis:', err);
//           reject(err);
//         });

//         (this.redisClient as Redis).connect().catch(reject);
//       });
//     }

//     return Promise.resolve();
//   }

//   getRedisClient(): RedisLike {
//     return this.redisClient;
//   }
// }
