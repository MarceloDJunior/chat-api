import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({
    description: 'The ID from the user sending the message',
  })
  @IsNotEmpty()
  fromId: number;

  @ApiProperty({
    description: 'The ID from the user receiving the message',
  })
  @IsNotEmpty()
  toId: number;

  @ApiProperty({
    description: 'Message date',
  })
  @IsNotEmpty()
  dateTime: Date;

  @ApiProperty({
    description: 'The message body',
  })
  @IsNotEmpty()
  text: string;
}
