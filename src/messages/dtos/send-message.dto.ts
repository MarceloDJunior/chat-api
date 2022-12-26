import { IsNotEmpty } from 'class-validator';

export class SendMessageDto {
  @IsNotEmpty()
  fromId: number;

  @IsNotEmpty()
  toId: number;

  @IsNotEmpty()
  text: string;
}
