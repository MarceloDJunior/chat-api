import { UsersModule } from '@/users/users.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationsController } from './conversations.controller';
import { Conversation } from './entities/conversation.entity';
import { ConversationsService } from './services/conversations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation]),
    forwardRef(() => UsersModule),
  ],
  controllers: [ConversationsController],
  providers: [ConversationsService],
  exports: [ConversationsService, TypeOrmModule],
})
export class ConversationsModule {}
