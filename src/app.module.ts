import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { loggerMiddleware } from './logger.middleware';
import { config } from './config/configutation';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { MessagesModule } from './messages/messages.module';
import { MessagesController } from './messages/messages.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.database.host,
      port: config.database.port,
      username: config.database.username,
      password: config.database.password,
      database: config.database.name,
      synchronize: true,
      autoLoadEntities: true,
    }),
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
