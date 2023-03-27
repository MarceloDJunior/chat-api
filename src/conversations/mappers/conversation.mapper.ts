import { MessageMapper } from '@/messages/mappers/message.mapper';
import { UserMapper } from '@/users/mappers/user.mapper';
import { ConversationDto } from '../dtos/conversation.dto';
import { Conversation } from '../entities/conversation.entity';

export class ConversationMapper {
  static toConversationDto(
    conversation: Conversation,
    currentUserId: number,
  ): ConversationDto {
    return {
      contact:
        currentUserId === conversation.user1.id
          ? UserMapper.toUserDto(conversation.user2)
          : UserMapper.toUserDto(conversation.user1),
      lastMessage: MessageMapper.toMessageDto(conversation.lastMessage),
      newMessages:
        conversation.lastMessage.fromId === currentUserId
          ? 0
          : conversation.newMessages,
    };
  }
}
