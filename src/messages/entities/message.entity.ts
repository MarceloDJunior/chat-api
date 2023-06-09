import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from '@/common/entities/base-entity';
import { User } from '@/users/entities/user.entity';

@Entity('messages')
export class Message extends BaseEntity {
  @Column()
  fromId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'fromId' })
  from: User;

  @Column()
  toId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'toId' })
  to: User;

  @Column()
  text: string;

  @CreateDateColumn()
  dateTime: Date;

  @Column({ default: false })
  read?: boolean;

  @Column({ default: null })
  fileUrl: string;

  @Column({ default: null })
  fileName: string;
}
