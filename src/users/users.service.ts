import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UpdateUserDto } from 'src/users/dtos/update-user.dto';
import { User } from 'src/users/interfaces/user.interface';

@Injectable()
export class UsersService {
  private users: User[] = [];

  create(data: CreateUserDto) {
    this.users.push({
      id: this.users.length + 1,
      ...data,
    });
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User {
    const user = this.users.find((user) => user.id === id);
    if (user) {
      return user;
    }
    throw new NotFoundException();
  }

  update(id: number, data: UpdateUserDto) {
    let updatedUser = this.findOne(id);
    updatedUser = { ...updatedUser, ...data };
    const userIndex = this.users.findIndex((user) => user.id === id);
    this.users[userIndex] = updatedUser;
    return updatedUser.id;
  }

  remove(id: number) {
    const updatedUsers = this.users.filter((user) => user.id !== id);
    this.users = updatedUsers;
  }
}
