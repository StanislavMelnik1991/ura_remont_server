import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Brand } from './brand.entity';
import { ProductType } from './type.entity';
import { Dictionary } from './dictionary.entity';

@Entity('prototypes')
export class ProductPrototype extends BaseEntity {
  @ManyToOne(() => Brand, (dict) => dict.id)
  @JoinColumn({
    name: 'brandId',
  })
  @Column()
  brandId: number;

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
    name: 'description',
  })
  @Column()
  description: number;

  @Column({ nullable: true })
  image: string;
}
