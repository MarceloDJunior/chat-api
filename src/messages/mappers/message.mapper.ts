import { MessageDto } from '@/messages/dtos/message.dto';
import { Message } from '@/messages/entities/message.entity';

export class MessageMapper {
  static toMessageDto(message: Message): MessageDto {
    return {
      id: message.id,
      text: message.text,
      dateTime: message.dateTime,
      from: {
        id: message.from?.id,
        email: message.from?.email,
        name: message.from?.name,
      },
      to: {
        id: message.to?.id,
        email: message.to?.email,
        name: message.to?.name,
      },
    };
  }
}
