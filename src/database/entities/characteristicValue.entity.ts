import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Characteristic } from './characteristic.entity';
import { ProductPrototype } from './prototype.entity';
import { CharacteristicValueSchemeType } from 'shared/schemas';

@Entity('characteristic_values')
@Unique(['prototypeId', 'characteristicId'])
export class CharacteristicValue implements CharacteristicValueSchemeType {
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

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
