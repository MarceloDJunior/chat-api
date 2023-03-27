import {
  Controller,
  Get,
  Headers,
  NotFoundException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiPaginatedResponse } from '@/common/decorators/api-paginated-response.decorator';
import { PageOptionsDto } from '@/common/dtos/page-options.dto';
import { PageDto } from '@/common/dtos/page.dto';
import { UsersService } from '@/users/services/users.service';
import { ConversationsService } from './services/conversations.service';
import { ConversationDto } from './dtos/conversation.dto';

@Controller('conversations')
export class ConversationsController {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiPaginatedResponse(ConversationDto)
  async getConversations(
    @Query() pageOptionsDto: PageOptionsDto,
    @Headers() headers: Record<string, string>,
  ): Promise<PageDto<ConversationDto>> {
    const currentUser = await this.usersService.getUserFromAuthHeaders(headers);
    if (currentUser) {
      return await this.conversationsService.getConversations(
        currentUser.id,
        pageOptionsDto,
      );
    }
    throw new NotFoundException();
  }
}
