import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from '@/users/users.controller';
import { UsersService } from '@/users/services/users.service';
import { AuthModule } from '@/auth/auth.module';
import { User } from './entities/user.entity';
import { MessagesModule } from '@/messages/messages.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthModule,
    forwardRef(() => MessagesModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
