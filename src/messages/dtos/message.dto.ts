import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '@/users/dtos/user.dto';

export class MessageDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  from: UserDto;

  @ApiProperty()
  to: UserDto;

  @ApiProperty()
  text: string;

  @ApiProperty()
  dateTime: Date;

  @ApiProperty()
  read: boolean;

  @ApiProperty()
  fileUrl: string | null;

  @ApiProperty()
  fileName: string | null;
}
