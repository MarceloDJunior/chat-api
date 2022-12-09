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
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

@Controller('users')
export class UsersController {
  @Get()
  findAll(): string {
    return 'This action returns all users';
  }

  @Get(':id')
  findOne(@Param('id') id: number): string {
    console.log(id);
    return `This action returns a #${id} user`;
  }

  @Post()
  @HttpCode(204)
  create(@Body() body: CreateUserDto): string {
    console.log(body);
    return 'This action adds a new user';
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    console.log(body);
    return `This action updates a #${id} user`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} user`;
  }
}
