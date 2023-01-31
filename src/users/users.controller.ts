import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UpdateUserDto } from 'src/users/dtos/update-user.dto';
import { UsersService } from 'src/users/services/users.service';
import { UserDto } from './dtos/user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Created successfully' })
  @ApiBadRequestResponse({ description: 'Validation errors' })
  create(@Body() body: CreateUserDto): void {
    this.usersService.create(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOkResponse({ type: UserDto })
  async findAll(): Promise<UserDto[]> {
    return await this.usersService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiOkResponse({ type: UserDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    const user = await this.usersService.findOne(id);
    if (user) {
      return user;
    }
    throw new NotFoundException();
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @ApiOkResponse({ type: UserDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ): Promise<UserDto> {
    const updatedUser = await this.usersService.update(id, body);
    if (updatedUser) {
      return updatedUser;
    }
    throw new NotFoundException();
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiNotFoundResponse({ description: 'User not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const user = await this.usersService.findOne(id);
    if (user) {
      return await this.usersService.remove(id);
    }
    throw new NotFoundException();
  }
}
