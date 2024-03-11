import { Column, Entity, JoinColumn, OneToOne, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { PrototypeProperty } from './prototypeProperty.entity';
import { Product } from '..';

@Entity('prototype_property_values')
export class PrototypePropertyValue extends BaseEntity {
  @OneToOne(() => Product, (dict) => dict.id)
  @JoinColumn({
    name: 'productId',
  })
  @Column()
  productId: number;

  @ManyToOne(() => PrototypeProperty, (dict) => dict.id)
  @JoinColumn({
    name: 'propertyId',
  })
  @Column()
  propertyId: number;

  @Column()
  value: string;
}
