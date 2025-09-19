// import { createClient } from 'redis';
// import { Service } from "typedi";

// @Service()
// export class RedisClient {
//     public redisClient;

//     constructor(){}

//     async init(){
//         this.redisClient = createClient({url: 'redis://redis:6379'});
//         this.redisClient.on('error', (err) => console.log('Redis Client Error', err));
//         await this.redisClient.connect();
//     }

//     getRedisClient(){
//         return this.redisClient;
//     }
// }

import {Redis} from 'ioredis';
import {Service} from 'typedi';

@Service()
export class RedisClient {
  private redisClient: Redis;

  constructor() {
    const redisOptions = {
      host: 'localhost', // Thay đổi thành địa chỉ của máy chủ Redis của bạn
      port: 6379, // Thay đổi thành cổng của máy chủ Redis của bạn
      // Các tùy chọn khác nếu cần
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
