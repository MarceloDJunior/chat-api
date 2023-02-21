import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  picture?: string;

  @ApiProperty({
    description: 'Auth0 sub that will be used as auth0 unique id',
  })
  sub?: string;
}
