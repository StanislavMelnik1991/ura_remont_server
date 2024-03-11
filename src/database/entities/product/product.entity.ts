import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { ProductPrototype } from '..';

@Entity('products')
export class Product extends BaseEntity {
  @ManyToOne(() => ProductPrototype, (dict) => dict.id)
  @JoinColumn({
    name: 'prototypeId',
  })
  @Column()
  prototypeId: number;

  @Column()
  externalId: string;

  @Column()
  externalName: string;

  @Column()
  availableQuantity: number;

  @Column()
  price: number;

  @Column({ nullable: true })
  soldQuantity: number;

  @Column({ nullable: true })
  pendingQuantity: number;
}
