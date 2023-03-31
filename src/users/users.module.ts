import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from '@/users/users.controller';
import { UsersService } from '@/users/services/users.service';
import { AuthModule } from '@/auth/auth.module';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
