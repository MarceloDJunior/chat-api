import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { MessageDto } from './dtos/message.dto';
import { SendMessageDto } from './dtos/send-message.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get(':user1/:user2')
  @ApiOkResponse({ type: MessageDto })
  async getMessages(
    @Param('user1', ParseIntPipe) user1: number,
    @Param('user2', ParseIntPipe) user2: number,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<MessageDto>> {
    return await this.messagesService.getMessages(user1, user2, pageOptionsDto);
  }

  @Post('send')
  @ApiOkResponse()
  async send(@Body() body: SendMessageDto): Promise<void> {
    return await this.messagesService.sendMessage(body);
  }
}
