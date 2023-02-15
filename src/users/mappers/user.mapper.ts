import { UserDto } from '@/users/dtos/user.dto';
import { User } from '@/users/entities/user.entity';

export class UserMapper {
  static toUserDto(user: User): UserDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
