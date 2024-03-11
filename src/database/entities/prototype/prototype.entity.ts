import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Dictionary, Brand, ProductType } from '..';

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
