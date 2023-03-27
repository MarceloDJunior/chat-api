import { UserDto } from '@/users/dtos/user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { MessageDto } from '@/messages/dtos/message.dto';

export class ConversationDto {
  @ApiProperty()
  contact: UserDto;

  @ApiProperty()
  lastMessage: MessageDto;

  @ApiProperty()
  newMessages: number;
}
