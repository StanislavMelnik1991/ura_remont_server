import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Dictionary } from './dictionary.entity';
import { ProductType } from './type.entity';

@Entity('characteristics')
export class Characteristic extends BaseEntity {
  @ManyToOne(() => ProductType, (dict) => dict.id)
  @JoinColumn({
    name: 'typeId',
  })
  @Column()
  typeId: number;

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

  @Column({ default: false })
  isFilter: boolean;

  @Column({ default: true })
  display: boolean;
}
