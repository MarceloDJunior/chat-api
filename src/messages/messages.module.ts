import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '@/users/users.module';
import { Message } from './entities/message.entity';
import { ChatGateway } from './gateways/chat.gateway';
import { MessagesController } from './messages.controller';
import { FileUploadService } from './services/file-upload.service';
import { MessagesService } from './services/messages.service';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), forwardRef(() => UsersModule)],
  controllers: [MessagesController],
  providers: [MessagesService, FileUploadService, ChatGateway],
  exports: [MessagesService, TypeOrmModule],
})
export class MessagesModule {}
