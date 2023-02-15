import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { loggerMiddleware } from './logger.middleware';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { MessagesModule } from './messages/messages.module';
import { MessagesController } from './messages/messages.controller';
import { AuthModule } from './auth/auth.module';
import { TypeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(TypeOrmConfig.getConfig()),
    UsersModule,
    MessagesModule,
    AuthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(loggerMiddleware)
      .forRoutes(UsersController, MessagesController);
  }
}
