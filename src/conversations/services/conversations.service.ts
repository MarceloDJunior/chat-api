import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageMetaDto } from '@/common/dtos/page-meta.dto';
import { PageOptionsDto } from '@/common/dtos/page-options.dto';
import { PageDto } from '@/common/dtos/page.dto';
import { ConversationDto } from '../dtos/conversation.dto';
import { UpdateConversationDto } from '../dtos/update-conversation.dto';
import { Conversation } from '../entities/conversation.entity';
import { ConversationMapper } from '../mappers/conversation.mapper';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private conversationsRepository: Repository<Conversation>,
  ) {}

  async getConversations(
    userId: number,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ConversationDto>> {
    const [conversations, itemCount] =
      await this.conversationsRepository.findAndCount({
        where: [
          {
            user1Id: userId,
          },
          {
            user2Id: userId,
          },
        ],
        order: {
          lastMessageDate: 'DESC',
        },
        relations: {
          user1: true,
          user2: true,
          lastMessage: {
            from: true,
            to: true,
          },
        },
      });

    const conversationsDto = conversations.map((conversation) =>
      ConversationMapper.toConversationDto(conversation, userId),
    );

    const paginatedConversations = conversationsDto.slice(
      pageOptionsDto.skip,
      pageOptionsDto.take + pageOptionsDto.skip,
    );

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(paginatedConversations, pageMetaDto);
  }

  async updateConversation(data: UpdateConversationDto) {
    const existingConversation = await this.conversationsRepository.findOne({
      where: [
        {
          user1Id: data.user1Id,
          user2Id: data.user2Id,
        },
        {
          user2Id: data.user1Id,
          user1Id: data.user2Id,
        },
      ],
      relations: {
        lastMessage: true,
      },
    });

    if (existingConversation) {
      const incrementedMessages =
        existingConversation.newMessages + (data.incrementNewMessagesBy ?? 0);
      const newMessages =
        existingConversation.lastMessage.fromId === data.lastMessage.from.id
          ? incrementedMessages
          : 0;
      await this.conversationsRepository.update(
        { id: existingConversation.id },
        {
          lastMessageId: data.lastMessage.id,
          lastMessageDate: data.lastMessage.dateTime,
          newMessages,
        },
      );
    } else {
      await this.conversationsRepository.insert({
        user1Id: data.user1Id,
        user2Id: data.user2Id,
        lastMessageId: data.lastMessage.id,
        lastMessageDate: data.lastMessage.dateTime,
        newMessages: data.incrementNewMessagesBy,
      });
    }
  }

  async resetNewMessages(senderId: number, receiverId: number) {
    const existingConversation = await this.conversationsRepository.findOne({
      where: [
        {
          user1Id: senderId,
          user2Id: receiverId,
        },
        {
          user2Id: senderId,
          user1Id: receiverId,
        },
      ],
      relations: {
        lastMessage: true,
      },
    });
    if (existingConversation?.lastMessage.toId === receiverId) {
      this.conversationsRepository.update(
        { id: existingConversation.id },
        {
          newMessages: 0,
        },
      );
    }
  }
}
