import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('dictionaries')
export class Dictionary extends BaseEntity {
  @ApiProperty({
    description: 'ru language value',
    required: true,
    example: 'язык',
  })
  @Column()
  ru: string;

  @ApiProperty({
    description: 'belarus language value',
    required: false,
    example: 'мова',
  })
  @Column({ nullable: true })
  be: string;

  @ApiProperty({
    description: 'ukrainian language value',
    required: false,
    example: 'мова',
  })
  @Column({ nullable: true })
  uk: string;

  @ApiProperty({
    description: 'english language value',
    required: false,
    example: 'language',
  })
  @Column({ nullable: true })
  en: string;

  @ApiProperty({
    description: 'poland language value',
    required: false,
    example: 'language',
  })
  @Column({ nullable: true })
  pl: string;
}
