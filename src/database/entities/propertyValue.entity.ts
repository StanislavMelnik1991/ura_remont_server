import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { PrototypeProperty } from './prototypeProperty.entity';
import { Product } from './product.entity';

@Entity('property_values')
@Unique(['productId', 'propertyId'])
export class PropertyValue extends BaseEntity {
  @ManyToOne(() => Product, (dict) => dict.id)
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
