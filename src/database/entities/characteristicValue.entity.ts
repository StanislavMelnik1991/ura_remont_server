import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { Characteristic } from './characteristic.entity';
import { ProductPrototype } from './prototype.entity';
import { CustomEntity } from './base.entity';
import { ICharacteristicValue } from 'shared/types';

@Entity('characteristic_values')
@Unique(['prototypeId', 'characteristicId'])
export class CharacteristicValue
  extends CustomEntity
  implements ICharacteristicValue
{
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
