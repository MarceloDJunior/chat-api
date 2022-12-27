import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';
import { PASSWORD_REGEX } from 'src/helpers/regex';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail(undefined, { message: 'email must be valid' })
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @Matches(PASSWORD_REGEX, {
    message:
      'password must contain at least one upper digit, one lower digit, one number and one symbol',
  })
  password: string;
}
