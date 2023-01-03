import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { SendMessageDto } from './dtos/send-message.dto';
import { Message } from './entities/message.entity';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get(':user1/:user2')
  async getMessages(
    @Param('user1', ParseIntPipe) user1: number,
    @Param('user2', ParseIntPipe) user2: number,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Message>> {
    return await this.messagesService.getMessages(user1, user2, pageOptionsDto);
  }

  @Post('send')
  async send(@Body() body: SendMessageDto): Promise<void> {
    return await this.messagesService.sendMessage(body);
  }
}
