import {Redis} from 'ioredis';
import {keyCaches} from '../config/keyCaches';

export class CacheRedis {
  private redisClient: Redis;

  constructor(redisClient: Redis) {
    this.redisClient = redisClient;
  }

  async makeCacheKey(key: string, params: string[] = []) {
    let keyCache = '';
    if (typeof keyCaches.cache.keys[key] !== 'undefined') {
      keyCache = `${keyCaches.cache.keys[key]}`;
      for (let param of params) {
        keyCache = keyCache.replace('%s', param);
      }
    }
    return keyCache;
  }

  async setCache(key: string, value: string, expireInSeconds: number = 3600): Promise<void> {
    return new Promise((resolve, reject) => {
      this.redisClient.set(key, value, (err) => {
        if (err) {
          console.error('Error setting cache:', err);
          reject(err);
        } else {
          if (expireInSeconds) {
            this.redisClient.expire(key, expireInSeconds, (expireErr) => {
              if (expireErr) {
                console.error('Error setting cache expiration:', expireErr);
                reject(expireErr);
              } else {
                resolve();
              }
            });
          } else {
            resolve();
          }
        }
      });
    });
  }

  async getCache(key: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      this.redisClient.get(key, (err, result) => {
        if (err) {
          console.error('Error getting cache:', err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}
