import {
  Body,
  Controller,
  Get,
  Headers,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse } from '@nestjs/swagger';
import { ApiPaginatedResponse } from '@/common/decorators/api-paginated-response.decorator';
import { PageOptionsDto } from '@/common/dtos/page-options.dto';
import { PageDto } from '@/common/dtos/page.dto';
import { MessageDto } from '@/messages/dtos/message.dto';
import { MessageAttachmentDto } from '@/messages/dtos/message-attachment.dto';
import { MessagesService } from '@/messages/services/messages.service';
import { UsersService } from '@/users/services/users.service';
import { ConversationsService } from './services/conversations.service';
import { ConversationDto } from './dtos/conversation.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('conversations')
export class ConversationsController {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly messagesService: MessagesService,
    private readonly usersService: UsersService,
  ) {}

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

  @Post('send-message')
  @ApiOkResponse()
  async send(
    @Body() message: MessageDto,
    @Headers() headers: Record<string, string>,
  ): Promise<MessageDto> {
    const currentUser = await this.usersService.getUserFromAuthHeaders(headers);
    if (!currentUser) {
      throw new UnauthorizedException();
    }
    let attachment: MessageAttachmentDto | undefined;
    if (message.fileName && message.fileUrl) {
      attachment = {
        fileUrl: message.fileUrl,
        fileName: message.fileName,
      };
    }
    const sentMessage = await this.messagesService.sendMessage(
      currentUser.id,
      message,
      attachment,
    );
    this.conversationsService.updateConversation({
      lastMessage: sentMessage,
      user1Id: currentUser.id,
      user2Id: message.to.id,
      incrementNewMessagesBy: 1,
    });
    return sentMessage;
  }

  @Get(':contactId/update-read')
  @ApiOkResponse()
  async updateRead(
    @Param('contactId', ParseIntPipe) contactId: number,
    @Headers() headers: Record<string, string>,
  ): Promise<void> {
    const currentUser = await this.usersService.getUserFromAuthHeaders(headers);
    if (currentUser) {
      await this.messagesService.updateRead(contactId, currentUser.id);
      await this.conversationsService.resetNewMessages(
        contactId,
        currentUser.id,
      );
    }
  }
}
