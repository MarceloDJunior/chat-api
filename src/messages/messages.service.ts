import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { SendMessageDto } from './dtos/send-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private messagesRepository: Repository<Message>,
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
    await this.messagesRepository.insert({
      fromId,
      toId,
      text,
    });
  }
}
