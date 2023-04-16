import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@/common/entities/base-entity';

@Entity('users')
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ default: null })
  picture?: string;

  @Column()
  auth0Id: string;
}
