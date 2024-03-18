import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Brand } from './brand.entity';
import { TypeEntity } from './type.entity';
import { Dictionary } from './dictionary.entity';
import { CustomEntity } from './base.entity';
import { IPrototype } from 'shared/types';

@Entity('prototypes')
export class ProductPrototype extends CustomEntity implements IPrototype {
  @ManyToOne(() => Brand, (dict) => dict.id)
  @JoinColumn({
    name: 'brandId',
  })
  @Column()
  brandId: number;

  @ManyToOne(() => TypeEntity, (dict) => dict.id)
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
    name: 'description',
  })
  @Column()
  description: number;
}
