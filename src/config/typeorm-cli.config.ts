import { DataSource } from 'typeorm';
import { config } from './configutation';

export default new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.name,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
});
