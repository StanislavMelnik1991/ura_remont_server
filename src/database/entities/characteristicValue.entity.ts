import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Characteristic } from './characteristic.entity';
import { ProductPrototype } from './prototype.entity';

@Entity('characteristic_values')
@Unique(['prototypeId', 'characteristicId'])
export class CharacteristicValue extends BaseEntity {
  @ManyToOne(() => ProductPrototype, (dict) => dict.id)
  @JoinColumn({
    name: 'prototypeId',
  })
  @Column()
  prototypeId: number;

  @ManyToOne(() => Characteristic, (dict) => dict.id)
  @JoinColumn({
    name: 'characteristicId',
  })
  @Column()
  characteristicId: number;

  @Column()
  value: string;
}
