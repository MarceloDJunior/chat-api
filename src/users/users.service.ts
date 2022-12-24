import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UpdateUserDto } from 'src/users/dtos/update-user.dto';
import { User } from 'src/users/interfaces/user.interface';
import { User as UserModel } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserModel) private usersRepository: Repository<UserModel>,
  ) {}

  async create(data: CreateUserDto) {
    const createdUser = await this.usersRepository.insert(data);
    return createdUser;
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async update(id: number, data: UpdateUserDto): Promise<User | null> {
    const user = await this.findOne(id);
    if (user) {
      user.name = data.name;
      user.email = data.email;
      await this.usersRepository.update(id, user);
      return user;
    }
    return null;
  }

  async remove(id: number) {
    await this.usersRepository.delete(id);
  }
}
