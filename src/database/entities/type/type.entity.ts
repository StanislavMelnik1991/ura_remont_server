import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Dictionary } from '..';

@Entity('types')
export class ProductType extends BaseEntity {
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

  @Column({ nullable: true })
  image?: string;
}
