import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Dictionary } from './dictionary.entity';
import { CustomEntity } from './base.entity';
import { IBrand } from 'shared/types';

@Entity('brands')
export class Brand extends CustomEntity implements IBrand {
  @ManyToOne(() => Dictionary, (dict) => dict.id)
  @JoinColumn({
    name: 'name',
  })
  @Column()
  name: number;

  @ManyToOne(() => Dictionary, (dict) => dict.id)
  @JoinColumn({
    name: 'description',
  })
  @Column()
  description: number;
}
