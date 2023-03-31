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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiPaginatedResponse } from '@/common/decorators/api-paginated-response.decorator';
import { PageOptionsDto } from '@/common/dtos/page-options.dto';
import { PageDto } from '@/common/dtos/page.dto';
import { FileUploadService } from '@/conversations/services/file-upload.service';
import { MessageDto } from '@/messages/dtos/message.dto';
import { SendMessageDto } from '@/messages/dtos/send-message.dto';
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
    private readonly fileUploadService: FileUploadService,
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
  @UseInterceptors(FileInterceptor('file'))
  @ApiOkResponse()
  async send(
    @Body() message: SendMessageDto,
    @UploadedFile() file: Express.Multer.File,
    @Headers() headers: Record<string, string>,
  ): Promise<MessageDto> {
    const currentUser = await this.usersService.getUserFromAuthHeaders(headers);
    if (!currentUser) {
      throw new UnauthorizedException();
    }
    let attachment: MessageAttachmentDto | undefined;
    if (file) {
      const fileName = file.originalname;
      const fileUrl = await this.fileUploadService.uploadFile(
        file.buffer,
        fileName,
      );
      attachment = {
        fileUrl,
        fileName,
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
      user2Id: message.toId,
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
