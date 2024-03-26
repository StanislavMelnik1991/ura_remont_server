import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { PrototypeProperty } from './property.entity';
import { Product } from './product.entity';
import { CustomEntity } from './base.entity';
import { IPropertyValue } from 'shared/types';

@Entity('property_values')
@Unique(['productId', 'propertyId'])
export class PropertyValue extends CustomEntity implements IPropertyValue {
  @ManyToOne(() => Product, (dict) => dict.id, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'productId',
  })
  @Column()
  productId: number;

  @ManyToOne(() => PrototypeProperty, (dict) => dict.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'propertyId',
  })
  @Column()
  propertyId: number;

  @Column()
  value: string;
}
