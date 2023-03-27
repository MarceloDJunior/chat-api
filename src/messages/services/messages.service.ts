import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
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
          fromId: user1,
          toId: user2,
        },
        {
          toId: user1,
          fromId: user2,
        },
      ],
      order: {
        dateTime: pageOptionsDto.order,
        id: pageOptionsDto.order,
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
    currentUserId: number,
    message: SendMessageDto,
    attachment?: MessageAttachmentDto,
  ): Promise<MessageDto> {
    const { toId, text } = message;
    const fromUser = await this.usersService.findById(currentUserId);

    if (!fromUser) {
      throw new NotFoundException('from user not found');
    }

    const toUser = await this.usersService.findById(toId);
    if (!toUser) {
      throw new NotFoundException('to user not found');
    }

    const insertedMessage = await this.messagesRepository.save({
      fromId: currentUserId,
      toId,
      text,
      dateTime: message.dateTime,
      fileUrl: attachment?.fileUrl,
      fileName: attachment?.fileName,
    });

    const messageDto = MessageMapper.toMessageDto(insertedMessage);
    messageDto.from = fromUser;
    messageDto.to = toUser;
    return messageDto;
  }

  async updateRead(fromId: number, toId: number) {
    await this.messagesRepository.update({ fromId, toId }, { read: true });
  }
}
