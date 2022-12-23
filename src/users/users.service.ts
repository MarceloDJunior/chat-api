import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UpdateUserDto } from 'src/users/dtos/update-user.dto';
import { User } from 'src/users/interfaces/user.interface';
import { User as UserModel, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel.name) private userModel: Model<UserDocument>,
  ) {}

  async create(data: CreateUserDto) {
    const dataWithId = { ...data, id: randomUUID() };
    const createdUser = new this.userModel(dataWithId);
    return await createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User | null> {
    return await this.userModel.findOne({ id }).exec();
  }

  async update(id: string, data: UpdateUserDto): Promise<User | null> {
    const user = await this.userModel.findOne({ id }).exec();
    if (user) {
      user.name = data.name;
      user.email = data.email;
      await user.save();
      return user;
    }
    return null;
  }

  async remove(id: string) {
    await this.userModel.findOneAndRemove({ id }).exec();
  }
}
