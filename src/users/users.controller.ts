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
import { AuthService } from '@/auth/auth.service';
import { CreateUserDto } from '@/users/dtos/create-user.dto';
import { UpdateUserDto } from '@/users/dtos/update-user.dto';
import { UsersService } from '@/users/services/users.service';
import { UserDto } from './dtos/user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
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
    const accessToken = this.extractAccessTokenFromHeaders(headers);
    const sub = this.authService.getSubFromAccessToken(accessToken);
    const user = await this.usersService.findByAuthId(sub);
    if (user) {
      return user;
    }
    throw new NotFoundException();
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

  private extractAccessTokenFromHeaders(
    headers: Record<string, string>,
  ): string {
    const [, accessToken] = headers.authorization.split(' ');
    if (accessToken) {
      return accessToken;
    }
    throw new Error('No token found');
  }
}
