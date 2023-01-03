import { Exclude } from 'class-transformer';
import { CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  @Exclude()
  public id: number;

  @CreateDateColumn()
  @Exclude()
  public createdAt: Date;
}
