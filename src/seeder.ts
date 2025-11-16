import { seeder } from 'nestjs-seeder';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { config } from './config/configuration';
import { UsersSeeder } from './users/seeders/users.seeder';
import { User } from './users/entities/user.entity';
import { Message } from './messages/entities/message.entity';
import { MessagesSeeder } from './messages/seeders/messages.seeder';

seeder({
  imports: [
    ConfigModule.forRoot(),
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
    TypeOrmModule.forFeature([User, Message]),
  ],
}).run([UsersSeeder, MessagesSeeder]);
