// import {RedisClient, RedisLike} from '../config/redis';

// export class RedisService {
//   private redisClient: RedisLike;

//   constructor() {
//     this.redisClient = new RedisClient().getRedisClient();
//   }

//   async makeKey(key: string, params: any[] = []): Promise<string> {
//     let keyCache = key;
//     for (let param of params) {
//       if (param) {
//         keyCache += `_${param}`;
//       }
//     }

//     return keyCache;
//   }

//   async get(keyCache: string): Promise<any> {
//     try {
//       const cachedData = await this.redisClient.get(keyCache);
//       return cachedData ? JSON.parse(cachedData) : null;
//     } catch (err) {
//       console.log('Redis command error:', err);
//     }
//   }

//   async set(keyCache: string, data: any, expired: number = 3600) {
//     try {
//       return await this.redisClient.set(keyCache, JSON.stringify(data), 'EX', expired);
//     } catch (err) {
//       console.log('Redis command error:', err);
//     }
//   }

//   async deleteByKey(keyCache: string) {
//     let keys = await this.redisClient.keys(`*${keyCache}*`);
//     if (!keys.length) {
//       return true;
//     }
//     return this.redisClient.del(keys);
//   }

//   async deleteStatic() {
//     let keys = await this.redisClient.keys('*heyo_*');
//     if (!keys.length) {
//       return true;
//     }
//     return this.redisClient.del(keys);
//   }

//   async deleteAll() {
//     let keys = await this.redisClient.keys('*');
//     if (!keys.length) {
//       return true;
//     }
//     return this.redisClient.del(keys);
//   }

//   async getExprireTime(keyCache) {
//     let exprireTime = await this.redisClient.ttl(keyCache, (err, ttl) => {
//       if (ttl === -2) {
//         return false;
//       } else if (ttl === -1) {
//         return false;
//       } else {
//         return ttl;
//       }
//     });
//     return exprireTime;
//   }
// }
