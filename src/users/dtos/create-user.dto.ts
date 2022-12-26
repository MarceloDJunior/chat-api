import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';
import { REGEX_FOR_UPPER_LOWER_NUMBER_AND_SYMBOL } from 'src/helpers/regex';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail(undefined, { message: 'email must be valid' })
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @Matches(REGEX_FOR_UPPER_LOWER_NUMBER_AND_SYMBOL, {
    message:
      'password must contain at least one upper digit, one lower digit, one number and one symbol',
  })
  password: string;
}
