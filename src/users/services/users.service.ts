import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '@/users/dtos/create-user.dto';
import { UpdateUserDto } from '@/users/dtos/update-user.dto';
import { User as UserModel } from '@/users/entities/user.entity';
import { UserDto } from '@/users/dtos/user.dto';
import { UserMapper } from '@/users/mappers/user.mapper';
import { AuthService } from '@/auth/auth.service';
import { UserAlreadyExistsError } from '../errors/user-already-exists';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserModel) private usersRepository: Repository<UserModel>,
    private readonly authService: AuthService,
  ) {}

  async create(data: CreateUserDto): Promise<UserDto> {
    const existingUser = await this.usersRepository.findOneBy({
      email: data.email,
    });
    if (existingUser) {
      throw new UserAlreadyExistsError();
    }
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

  async findById(id: number): Promise<UserDto | null> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (user) {
      return UserMapper.toUserDto(user);
    }
    return null;
  }

  async findByAuthId(auth0Id: string): Promise<UserDto | null> {
    const user = await this.usersRepository.findOne({ where: { auth0Id } });
    if (user) {
      return UserMapper.toUserDto(user);
    }
    return null;
  }

  async update(id: number, data: UpdateUserDto): Promise<UserDto | null> {
    const user = await this.findById(id);
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

  async getUserFromAccessToken(accessToken: string): Promise<UserDto | null> {
    const sub = this.authService.getSubFromAccessToken(accessToken);
    const user = await this.findByAuthId(sub);
    if (user) {
      return user;
    }
    return null;
  }

  async getUserFromAuthHeaders(
    headers: Record<string, string>,
  ): Promise<UserDto | null> {
    const accessToken = this.authService.extractAccessTokenFromHeaders(headers);
    return this.getUserFromAccessToken(accessToken);
  }
}
