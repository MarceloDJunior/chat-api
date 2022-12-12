import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UpdateUserDto } from 'src/users/dtos/update-user.dto';
import { User } from 'src/users/interfaces/user.interface';
import { UsersService } from 'src/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @HttpCode(204)
  create(@Body() body: CreateUserDto): void {
    this.usersService.create(body);
  }

  @Get()
  findAll(): User[] {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): User {
    return this.usersService.findOne(parseInt(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    this.usersService.update(parseInt(id), body);
    return id;
  }

  @Delete(':id')
  remove(@Param('id') id: string): void {
    this.usersService.remove(parseInt(id));
  }
}
