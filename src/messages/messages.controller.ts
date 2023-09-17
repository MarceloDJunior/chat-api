import {
  Controller,
  Get,
  Headers,
  NotFoundException,
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
import { UsersService } from '@/users/services/users.service';
import { MessageDto } from './dtos/message.dto';
import { MessagesService } from './services/messages.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { FileUploadService } from './services/file-upload.service';

@UseGuards(AuthGuard('jwt'))
@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly usersService: UsersService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Get(':userId')
  @ApiPaginatedResponse(MessageDto)
  async getMessages(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() pageOptionsDto: PageOptionsDto,
    @Headers() headers: Record<string, string>,
  ): Promise<PageDto<MessageDto>> {
    const currentUser = await this.usersService.getUserFromAuthHeaders(headers);
    if (!currentUser) {
      throw new UnauthorizedException();
    }
    return await this.messagesService.getMessages(
      currentUser.id,
      userId,
      pageOptionsDto,
    );
  }

  @Get('presigned-url/:filename')
  @ApiOkResponse()
  async getPresignedUrl(
    @Headers() headers: Record<string, string>,
    @Param('filename') filename: string,
  ): Promise<string> {
    const currentUser = await this.usersService.getUserFromAuthHeaders(headers);
    if (currentUser) {
      return await this.fileUploadService.getPresignedUrl(filename);
    }
    throw new NotFoundException();
  }
}
