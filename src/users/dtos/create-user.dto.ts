import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';
import { PASSWORD_REGEX } from '@/common/helpers/regex';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail(undefined, { message: 'email must be valid' })
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  @Matches(PASSWORD_REGEX, {
    message:
      'password must contain at least one upper digit, one lower digit, one number and one symbol',
  })
  password: string;
}
