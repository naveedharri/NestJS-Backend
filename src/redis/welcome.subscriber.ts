import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';

@Injectable()
export class WelcomeSubscriber {
  constructor(private readonly redisService: RedisService) {
    this.setupSubscriber();
  }

  private setupSubscriber() {
    const subscriber = this.redisService.getSubscriber();

    subscriber.subscribe('user:welcome', (err) => {
      if (err) {
        console.error('Failed to subscribe to user:welcome channel:', err);
      } else {
        console.log('Subscribed to user:welcome channel');
      }
    });

    subscriber.on('message', (channel, message) => {
      if (channel === 'user:welcome') {
        const data = JSON.parse(message);
        console.log(`Welcome email sent to: ${data.email}`);
      }
    });
  }
}
