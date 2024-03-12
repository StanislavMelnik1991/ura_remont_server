import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('dictionaries')
export class Dictionary extends BaseEntity {
  @Column()
  ru: string;

  @Column({ nullable: true })
  be: string;

  @Column({ nullable: true })
  uk: string;

  @Column({ nullable: true })
  en: string;

  @Column({ nullable: true })
  pl: string;
}
