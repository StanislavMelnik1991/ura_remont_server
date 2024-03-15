import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductPrototype } from './prototype.entity';
import { ProductSchemeType } from 'shared/schemas';

@Entity('products')
export class Product implements ProductSchemeType {
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ProductPrototype, (dict) => dict.id)
  @JoinColumn({
    name: 'prototypeId',
  })
  @Column({ nullable: true })
  prototypeId: number;

  @Column({ unique: true })
  externalId: string;

  @Column({ nullable: true })
  externalName?: string;

  @Column()
  availableQuantity: number;

  @Column()
  price: number;

  @Column({ default: 0 })
  soldQuantity: number;

  @Column({ default: 0 })
  pendingQuantity: number;
}
