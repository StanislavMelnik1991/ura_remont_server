import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Dictionary } from '..';
import { ProductPrototype } from './prototype.entity';

@Entity('prototype_properties')
export class PrototypeProperty extends BaseEntity {
  @ManyToOne(() => ProductPrototype, (dict) => dict.id)
  @JoinColumn({
    name: 'prototypeId',
  })
  @Column()
  prototypeId: number;

  @ManyToOne(() => Dictionary, (dict) => dict.id)
  @JoinColumn({
    name: 'name',
  })
  @Column()
  name: number;

  @ManyToOne(() => Dictionary, (dict) => dict.id)
  @JoinColumn({
    name: 'suffix',
  })
  @Column()
  suffix: number;
}
