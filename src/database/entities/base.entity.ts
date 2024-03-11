import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity as Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export class BaseEntity extends Entity {
  @ApiProperty({
    description: 'ID',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Creation date',
    example: new Date(),
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Updating date',
    example: new Date(),
    required: false,
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
