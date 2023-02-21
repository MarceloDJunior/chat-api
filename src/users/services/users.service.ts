import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '@/users/dtos/create-user.dto';
import { UpdateUserDto } from '@/users/dtos/update-user.dto';
import { User as UserModel } from '@/users/entities/user.entity';
import { UserDto } from '@/users/dtos/user.dto';
import { UserMapper } from '@/users/mappers/user.mapper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserModel) private usersRepository: Repository<UserModel>,
  ) {}

  async create(data: CreateUserDto): Promise<UserDto> {
    const createdUser = await this.usersRepository.insert({
      email: data.email,
      name: data.name,
      picture: data.picture,
      auth0Id: data.sub,
    });
    return { id: createdUser.raw.insertId, ...data };
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
      user.picture = data.picture;
      await this.usersRepository.update(id, user);
      return user;
    }
    return null;
  }

  async remove(id: number) {
    await this.usersRepository.delete(id);
  }

  async createOrUpdate(user: CreateUserDto): Promise<UserDto> {
    const foundUser = await this.usersRepository.findOneBy({
      auth0Id: user.sub,
    });
    if (foundUser) {
      foundUser.email = user.email;
      foundUser.name = user.name;
      foundUser.picture = user.picture;
      await this.usersRepository.update(foundUser.id, foundUser);
      return foundUser;
    }
    const createdUser = await this.create(user);
    return createdUser;
  }
}
