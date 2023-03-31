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
  Headers,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from '@/users/dtos/create-user.dto';
import { UpdateUserDto } from '@/users/dtos/update-user.dto';
import { UsersService } from '@/users/services/users.service';
import { UserDto } from './dtos/user.dto';
import { UserAlreadyExistsError } from './errors/user-already-exists';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/auth0-login')
  @HttpCode(200)
  @ApiNoContentResponse({ description: 'Created successfully' })
  @ApiBadRequestResponse({ description: 'Validation errors' })
  async auth0Login(@Body() body: CreateUserDto): Promise<void> {
    await this.usersService.createOrUpdate(body);
  }

  @Post()
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Created successfully' })
  @ApiBadRequestResponse({ description: 'Validation errors' })
  async createOrUpdateUser(@Body() body: CreateUserDto): Promise<void> {
    try {
      await this.usersService.create(body);
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @ApiOkResponse({ type: UserDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  async me(@Headers() headers: Record<string, string>): Promise<UserDto> {
    const user = await this.usersService.getUserFromAuthHeaders(headers);
    if (user) {
      return user;
    }
    throw new UnauthorizedException();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('contacts')
  @ApiOkResponse({ type: UserDto, isArray: true })
  async myContacts(
    @Headers() headers: Record<string, string>,
  ): Promise<UserDto[]> {
    const currentUser = await this.usersService.getUserFromAuthHeaders(headers);
    if (!currentUser) {
      throw new NotFoundException();
    }
    const users = await this.usersService.findAll();
    return users.filter((user) => user.id !== currentUser.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiOkResponse({ type: UserDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    const user = await this.usersService.findById(id);
    if (user) {
      return user;
    }
    throw new UnauthorizedException();
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
    throw new UnauthorizedException();
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiNotFoundResponse({ description: 'User not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const user = await this.usersService.findById(id);
    if (user) {
      return await this.usersService.remove(id);
    }
    throw new UnauthorizedException();
  }
}
