import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { loggerMiddleware } from 'src/logger.middleware';
import { UsersController } from 'src/users/users.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(loggerMiddleware).forRoutes(UsersController);
  }
}
