import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/users/entities/user.entity';

@Injectable()
export class UsersSeeder implements Seeder {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async seed(): Promise<void> {
    await this.usersRepository.insert([
      {
        name: 'User 1',
        email: 'user1@test.com',
        auth0Id: 'fdkopsfkdjaiodjsij37634rte8ijdioaso',
      },
      {
        name: 'User 2',
        email: 'user2@test.com',
        auth0Id: 'jfiodgfhdugdoisjr3824t6yfbdyg2368d',
      },
    ]);
  }

  async drop(): Promise<void> {
    await this.usersRepository.delete({});
  }
}
