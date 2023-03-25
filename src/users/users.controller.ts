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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { MessagesService } from '@/messages/services/messages.service';
import { CreateUserDto } from '@/users/dtos/create-user.dto';
import { UpdateUserDto } from '@/users/dtos/update-user.dto';
import { UsersService } from '@/users/services/users.service';
import { UserDto } from './dtos/user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly messagesService: MessagesService,
  ) {}

  @Post('/auth0-login')
  @HttpCode(200)
  @ApiNoContentResponse({ description: 'Created successfully' })
  @ApiBadRequestResponse({ description: 'Validation errors' })
  auth0Login(@Body() body: CreateUserDto): void {
    this.usersService.createOrUpdate(body);
  }

  @Post()
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Created successfully' })
  @ApiBadRequestResponse({ description: 'Validation errors' })
  createOrUpdateUser(@Body() body: CreateUserDto): void {
    this.usersService.create(body);
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
    throw new NotFoundException();
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
    for (const user of users) {
      const lastMessage = await this.messagesService.getLastMessage(
        currentUser.id,
        user.id,
      );
      if (lastMessage) {
        user.lastMessage = lastMessage;
      }
    }

    const orderedUsers = users.sort((user1, user2) => {
      const user1Message = user1.lastMessage?.dateTime.getTime() ?? 0;
      const user2Message = user2.lastMessage?.dateTime.getTime() ?? 0;
      if (user1Message > user2Message) {
        return -1;
      } else if (user1Message < user2Message) {
        return 1;
      } else {
        return 0;
      }
    });

    return orderedUsers.filter((user) => user.id !== currentUser.id);
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
    const user = await this.usersService.findById(id);
    if (user) {
      return await this.usersService.remove(id);
    }
    throw new NotFoundException();
  }
}
