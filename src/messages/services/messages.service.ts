import { Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '@/users/services/users.service';
import { PageOptionsDto } from '@/common/dtos/page-options.dto';
import { PageDto } from '@/common/dtos/page.dto';
import { PageMetaDto } from '@/common/dtos/page-meta.dto';
import { SendMessageDto } from '@/messages/dtos/send-message.dto';
import { Message } from '@/messages/entities/message.entity';
import { MessageDto } from '@/messages/dtos/message.dto';
import { MessageMapper } from '@/messages/mappers/message.mapper';
import { MessageAttachmentDto } from '@/messages/dtos/message-attachment.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private messagesRepository: Repository<Message>,
    private readonly usersService: UsersService,
  ) {}

  async getMessages(
    user1: number,
    user2: number,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<MessageDto>> {
    const [messages, itemCount] = await this.messagesRepository.findAndCount({
      where: [
        {
          from: {
            id: In([user1, user2]),
          },
        },
        {
          to: {
            id: In([user1, user2]),
          },
        },
      ],
      order: {
        dateTime: pageOptionsDto.order,
      },
      relations: {
        from: true,
        to: true,
      },
    });

    const messagesDto = messages.map(MessageMapper.toMessageDto);

    const paginatedMessages = messagesDto.slice(
      pageOptionsDto.skip,
      pageOptionsDto.take + pageOptionsDto.skip,
    );

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(paginatedMessages, pageMetaDto);
  }

  async sendMessage(
    { fromId, toId, text }: SendMessageDto,
    attachment?: MessageAttachmentDto,
  ): Promise<void> {
    const fromUser = await this.usersService.findOne(fromId);

    if (!fromUser) {
      throw new NotFoundException('from user not found');
    }

    const toUser = await this.usersService.findOne(toId);
    if (!toUser) {
      throw new NotFoundException('to user not found');
    }

    await this.messagesRepository.insert({
      fromId,
      toId,
      text,
      fileUrl: attachment?.fileUrl,
      fileName: attachment?.fileName,
    });
  }
}
