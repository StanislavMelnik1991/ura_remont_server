import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Dictionary } from './dictionary.entity';
import { CustomEntity } from './base.entity';
import { IProductType } from 'shared/types';

@Entity('types')
export class TypeEntity extends CustomEntity implements IProductType {
  @ManyToOne(() => Dictionary, (dict) => dict.id)
  @JoinColumn({
    name: 'name',
  })
  @Column({ nullable: false })
  name: number;

  @ManyToOne(() => Dictionary, (dict) => dict.id)
  @JoinColumn({
    name: 'description',
  })
  @Column()
  description: number;
}
