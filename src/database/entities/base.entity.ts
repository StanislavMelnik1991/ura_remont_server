import {
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity as Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export class BaseEntity extends Entity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
