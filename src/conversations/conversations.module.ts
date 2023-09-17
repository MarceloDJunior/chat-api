import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesModule } from '@/messages/messages.module';
import { UsersModule } from '@/users/users.module';
import { ConversationsController } from './conversations.controller';
import { Conversation } from './entities/conversation.entity';
import { ChatGateway } from './gateways/chat.gateway';
import { ConversationsService } from './services/conversations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation]),
    UsersModule,
    MessagesModule,
  ],
  controllers: [ConversationsController],
  providers: [ConversationsService, ChatGateway],
  exports: [ConversationsService],
})
export class ConversationsModule {}
