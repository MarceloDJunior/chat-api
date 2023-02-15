import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '@/common/entities/base-entity';
import { Message } from '@/messages/entities/message.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Message, (messages) => messages.fromId)
  messagesFrom: Message[];

  @OneToMany(() => Message, (messages) => messages.toId)
  messagesTo: Message[];
}
