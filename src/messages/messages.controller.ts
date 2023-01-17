import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOkResponse } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { MessageAttachmentDto } from './dtos/message-attachment.dto';
import { MessageDto } from './dtos/message.dto';
import { SendMessageDto } from './dtos/send-message.dto';
import { FileUploadService } from './services/file-upload.service';
import { MessagesService } from './services/messages.service';

@Controller('messages')
export class MessagesController {
  constructor(
    private messagesService: MessagesService,
    private fileUploadService: FileUploadService,
  ) {}

  @Get(':user1/:user2')
  @ApiPaginatedResponse(MessageDto)
  async getMessages(
    @Param('user1', ParseIntPipe) user1: number,
    @Param('user2', ParseIntPipe) user2: number,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<MessageDto>> {
    return await this.messagesService.getMessages(user1, user2, pageOptionsDto);
  }

  @Post('send')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOkResponse()
  async send(
    @Body() body: SendMessageDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
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
    return await this.messagesService.sendMessage(body, attachment);
  }
}
