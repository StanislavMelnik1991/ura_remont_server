import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Dictionary } from './dictionary.entity';
import { ProductPrototype } from './prototype.entity';
import { CustomEntity } from './base.entity';
import { IProperty } from 'shared/types';

@Entity('properties')
export class PrototypeProperty extends CustomEntity implements IProperty {
  @ManyToOne(() => ProductPrototype, (dict) => dict.id, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'prototypeId',
  })
  @Column()
  prototypeId: number;

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
