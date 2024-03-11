import { Column, Entity, JoinColumn, OneToOne, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { TypeProperty } from './typeProperty.entity';
import { ProductPrototype } from '../';

@Entity('type_property_values')
export class TypePropertyValue extends BaseEntity {
  @OneToOne(() => ProductPrototype, (dict) => dict.id)
  @JoinColumn({
    name: 'prototypeId',
  })
  @Column()
  prototypeId: number;

  @ManyToOne(() => TypeProperty, (dict) => dict.id)
  @JoinColumn({
    name: 'propertyId',
  })
  @Column()
  propertyId: number;

  @Column()
  value: string;
}
