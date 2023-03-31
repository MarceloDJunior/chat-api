import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { loggerMiddleware } from './logger.middleware';
import { TypeOrmConfig } from './config/typeorm.config';
import { ConversationsModule } from './conversations/conversations.module';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { MessagesController } from './messages/messages.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(TypeOrmConfig.getConfig()),
    UsersModule,
    ConversationsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(loggerMiddleware)
      .forRoutes(UsersController, MessagesController);
  }
}
