import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from './configuration';

export class TypeOrmConfig {
  static getConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: config.database.host,
      port: config.database.port,
      username: config.database.username,
      password: config.database.password,
      database: config.database.name,
      autoLoadEntities: true,
      migrations: [__dirname + '/../migrations/*{.ts,.js}'],
      synchronize: true,
      logging: false,
    };
  }
}
