import { Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';
import { SendMessageDto } from './dtos/send-message.dto';
import { Message } from './entities/message.entity';

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
  ): Promise<PageDto<Message>> {
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
    });

    const paginatedMessages = messages.slice(
      pageOptionsDto.skip,
      pageOptionsDto.take + pageOptionsDto.skip,
    );

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(paginatedMessages, pageMetaDto);
  }

  async sendMessage({ fromId, toId, text }: SendMessageDto): Promise<void> {
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
    });
  }
}
