import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { loggerMiddleware } from './logger.middleware';
import { config } from './config/configutation';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { User } from './users/entities/user.entity';
import { MessagesModule } from './messages/messages.module';
import { MessagesController } from './messages/messages.controller';
import { Message } from './messages/entities/message.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.database.host,
      port: config.database.port,
      username: config.database.username,
      password: config.database.password,
      database: config.database.name,
      entities: [User, Message],
      synchronize: true,
    }),
    UsersModule,
    MessagesModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(loggerMiddleware)
      .forRoutes(UsersController, MessagesController);
  }
}
