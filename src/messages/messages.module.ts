import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '@/users/users.module';
import { Message } from './entities/message.entity';
import { MessagesController } from './messages.controller';
import { MessagesService } from './services/messages.service';
import { FileUploadService } from './services/file-upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), UsersModule],
  controllers: [MessagesController],
  providers: [MessagesService, FileUploadService],
  exports: [MessagesService],
})
export class MessagesModule {}
