import { Column, Entity } from 'typeorm';
import { CustomEntity } from './base.entity';
import { IDictionary } from 'shared/types';

@Entity('dictionaries')
export class Dictionary extends CustomEntity implements IDictionary {
  @Column({ default: '' })
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
