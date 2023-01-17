import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UpdateUserDto } from 'src/users/dtos/update-user.dto';
import { User as UserModel } from '../entities/user.entity';
import { UserDto } from '../dtos/user.dto';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserModel) private usersRepository: Repository<UserModel>,
  ) {}

  async create(data: CreateUserDto) {
    const createdUser = await this.usersRepository.insert(data);
    return createdUser;
  }

  async findAll(): Promise<UserDto[]> {
    const users = await this.usersRepository.find();
    return users.map(UserMapper.toUserDto);
  }

  async findOne(id: number): Promise<UserDto | null> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (user) {
      return UserMapper.toUserDto(user);
    }
    return null;
  }

  async update(id: number, data: UpdateUserDto): Promise<UserDto | null> {
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
