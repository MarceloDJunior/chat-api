import { UserDto } from '../dtos/user.dto';
import { User } from '../entities/user.entity';

export class UserMapper {
  static toUserDto(user: User): UserDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
