import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DictionarySchemeType } from 'shared/schemas';

@Entity('dictionaries')
export class Dictionary implements DictionarySchemeType {
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

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
