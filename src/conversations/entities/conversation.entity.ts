import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from '@/common/entities/base-entity';
import { Message } from '@/messages/entities/message.entity';
import { User } from '@/users/entities/user.entity';

@Entity('conversations')
export class Conversation extends BaseEntity {
  @Column()
  user1Id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user1Id' })
  user1: User;

  @Column()
  user2Id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user2Id' })
  user2: User;

  @Column()
  lastMessageId: number;

  @OneToOne(() => Message)
  @JoinColumn({ name: 'lastMessageId' })
  lastMessage: Message;

  @Column()
  lastMessageDate: Date;

  @Column()
  newMessages: number;
}
