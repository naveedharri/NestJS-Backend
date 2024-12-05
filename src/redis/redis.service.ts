import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redisPublisher: Redis;
  private redisSubscriber: Redis;

  constructor() {
    this.redisPublisher = new Redis();
    this.redisSubscriber = new Redis();
  }

  onModuleInit() {
    console.log('RedisService initialized.');
  }

  onModuleDestroy() {
    this.redisPublisher.disconnect();
    this.redisSubscriber.disconnect();
  }

  getPublisher(): Redis {
    return this.redisPublisher;
  }

  getSubscriber(): Redis {
    return this.redisSubscriber;
  }
}
