import {
  Controller,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiPaginatedResponse } from '@/common/decorators/api-paginated-response.decorator';
import { PageOptionsDto } from '@/common/dtos/page-options.dto';
import { PageDto } from '@/common/dtos/page.dto';
import { MessageDto } from './dtos/message.dto';
import { MessagesService } from './services/messages.service';
import { UsersService } from '@/users/services/users.service';

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(':userId')
  @ApiPaginatedResponse(MessageDto)
  async getMessages(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() pageOptionsDto: PageOptionsDto,
    @Headers() headers: Record<string, string>,
  ): Promise<PageDto<MessageDto>> {
    const currentUser = await this.userService.getUserFromAuthHeaders(headers);
    if (!currentUser) {
      throw new UnauthorizedException();
    }
    return await this.messagesService.getMessages(
      currentUser.id,
      userId,
      pageOptionsDto,
    );
  }
}
