import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

const user1 = new User();
user1.name = 'User 1';
user1.email = 'user1@test.com';
user1.password = 'Password123';
user1.messagesFrom = [];
user1.messagesTo = [];

const user2 = new User();
user2.name = 'User 2';
user2.email = 'user2@test.com';
user2.password = 'Password123';
user2.messagesFrom = [];
user2.messagesTo = [];

@Injectable()
export class UsersSeeder implements Seeder {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async seed(): Promise<void> {
    await this.usersRepository.insert([user1, user2]);
  }

  async drop(): Promise<void> {
    await this.usersRepository.remove([user1, user2]);
  }
}
