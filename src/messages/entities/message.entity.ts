import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base-entity';
import { User } from '../../users/entities/user.entity';

@Entity('messages')
export class Message extends BaseEntity {
  @Column()
  fromId: number;

  @ManyToOne(() => User, (user) => user.messagesFrom)
  @JoinColumn({ name: 'fromId' })
  from: User;

  @Column()
  toId: number;

  @ManyToOne(() => User, (user) => user.messagesTo)
  @JoinColumn({ name: 'toId' })
  to: User;

  @Column()
  text: string;

  @Column({ default: new Date() })
  dateTime: Date;

  @Column({ default: false })
  read?: boolean;

  @Column({ default: null })
  fileUrl?: string;

  @Column({ default: null })
  fileName?: string;
}
