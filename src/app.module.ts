import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from './redis/redis.module';
import { WelcomeSubscriber } from './redis/welcome.subscriber';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'testuser',
      password: 'testpassword',
      database: 'testdatabase6',
      entities: ['./dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UserModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService, WelcomeSubscriber],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
