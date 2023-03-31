import { ApiProperty } from '@nestjs/swagger';
import { MessageDto } from '@/messages/dtos/message.dto';

export class UpdateConversationDto {
  @ApiProperty()
  user1Id: number;

  @ApiProperty()
  user2Id: number;

  @ApiProperty()
  lastMessage: MessageDto;

  @ApiProperty()
  incrementNewMessagesBy?: number;
}
