import { Message } from 'src/messages/entities/message.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

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
