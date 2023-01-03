import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '../entities/message.entity';

@Injectable()
export class MessagesSeeder implements Seeder {
  constructor(
    @InjectRepository(Message) private messagesRepository: Repository<Message>,
  ) {}

  async seed(): Promise<void> {
    await this.messagesRepository.insert([
      {
        fromId: 1,
        toId: 2,
        read: true,
        text: 'Hello!',
        dateTime: new Date(),
      },
      {
        fromId: 2,
        toId: 1,
        read: true,
        text: 'Hi! How are you?',
        dateTime: new Date(),
      },
      {
        fromId: 1,
        toId: 2,
        read: true,
        text: "I'm great, how about you?",
        dateTime: new Date(),
      },
      {
        fromId: 2,
        toId: 1,
        read: true,
        text: "I'm good",
        dateTime: new Date(),
      },
      {
        fromId: 1,
        toId: 2,
        read: true,
        text: 'Good to know! ',
        dateTime: new Date(),
      },
      {
        fromId: 1,
        toId: 2,
        read: true,
        text: 'Hey do do you have 100 dollars to borrow?',
        dateTime: new Date(),
      },
      {
        fromId: 1,
        toId: 2,
        read: false,
        text: 'I promise I will give you back next week',
        dateTime: new Date(),
      },
      {
        fromId: 1,
        toId: 2,
        read: false,
        text: 'Hello?',
        dateTime: new Date(),
      },
    ]);
  }

  async drop(): Promise<void> {
    await this.messagesRepository.delete({});
  }
}
