import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Dictionary } from './dictionary.entity';
import { ProductPrototype } from './prototype.entity';
import { CustomEntity } from './base.entity';
import { IPropertyFull } from 'shared/types';

@Entity('properties')
export class PrototypeProperty extends CustomEntity implements IPropertyFull {
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
  name: Dictionary;
  @Column()
  nameId: number;

  @OneToOne(() => Dictionary, (dict) => dict.id)
  @JoinColumn({
    name: 'suffix',
  })
  suffix: Dictionary;
  @Column()
  suffixId: number;

  @Column({ default: false })
  isFilter: boolean;

  @Column({ default: true })
  display: boolean;
}
