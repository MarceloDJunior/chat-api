import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { SendMessageDto } from './dtos/send-message.dto';
import { Message } from './entities/message.entity';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get(':user1/:user2')
  async findByUsers(
    @Param('user1', ParseIntPipe) user1: number,
    @Param('user2', ParseIntPipe) user2: number,
  ): Promise<Message[]> {
    return await this.messagesService.getRecentMessages(user1, user2);
  }

  @Post('send')
  async send(@Body() body: SendMessageDto): Promise<void> {
    return await this.messagesService.sendMessage(body);
  }
}
