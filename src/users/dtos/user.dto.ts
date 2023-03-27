import { MessageDto } from '@/messages/dtos/message.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  picture?: string;

  @ApiProperty()
  email: string;
}
