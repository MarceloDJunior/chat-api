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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOkResponse } from '@nestjs/swagger';
import { ApiPaginatedResponse } from '@/common/decorators/api-paginated-response.decorator';
import { PageOptionsDto } from '@/common/dtos/page-options.dto';
import { PageDto } from '@/common/dtos/page.dto';
import { MessageAttachmentDto } from './dtos/message-attachment.dto';
import { MessageDto } from './dtos/message.dto';
import { SendMessageDto } from './dtos/send-message.dto';
import { FileUploadService } from './services/file-upload.service';
import { MessagesService } from './services/messages.service';
import { UsersService } from '@/users/services/users.service';

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly fileUploadService: FileUploadService,
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
    if (currentUser) {
      return await this.messagesService.getMessages(
        currentUser.id,
        userId,
        pageOptionsDto,
      );
    }
    throw new NotFoundException();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('send')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOkResponse()
  async send(
    @Body() body: SendMessageDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<MessageDto> {
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
