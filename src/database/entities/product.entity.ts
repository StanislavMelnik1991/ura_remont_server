import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ProductPrototype } from './prototype.entity';

@Entity('products')
export class Product extends BaseEntity {
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
