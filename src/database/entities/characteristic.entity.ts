import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Dictionary } from './dictionary.entity';
import { TypeEntity } from './type.entity';
import { CustomEntity } from './base.entity';
import { ICharacteristic } from 'shared/types';

@Entity('characteristics')
export class Characteristic extends CustomEntity implements ICharacteristic {
  @ManyToOne(() => TypeEntity, (dict) => dict.id, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'typeId',
  })
  @Column()
  typeId: number;

  @OneToOne(() => Dictionary, (dict) => dict.id)
  @JoinColumn({
    name: 'name',
  })
  @Column()
  name: number;

  @OneToOne(() => Dictionary, (dict) => dict.id)
  @JoinColumn({
    name: 'suffix',
  })
  @Column()
  suffix: number;

  @Column({ default: false })
  isFilter: boolean;

  @Column({ default: true })
  display: boolean;
}
