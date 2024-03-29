import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ProductPrototype } from './prototype.entity';
import { CustomEntity } from './base.entity';
import { IProduct } from 'shared/types';

@Entity('products')
export class Product extends CustomEntity implements IProduct {
  @ManyToOne(() => ProductPrototype, (dict) => dict.id, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'prototypeId',
  })
  @Column()
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
