import { BaseEntity } from 'src/common/entities/base-entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
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
}
