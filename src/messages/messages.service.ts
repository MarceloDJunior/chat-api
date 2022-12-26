import { Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { SendMessageDto } from './dtos/send-message.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private messagesRepository: Repository<Message>,
    private readonly usersService: UsersService,
  ) {}

  async getRecentMessages(user1: number, user2: number): Promise<Message[]> {
    return await this.messagesRepository.find({
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
        dateTime: 'DESC',
      },
      take: 30,
    });
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
