import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Dictionary } from './dictionary.entity';
import { CustomEntity } from './base.entity';
import { IProductType } from 'shared/types';
import { ImageList } from './imageList.entity';

@Entity('types')
export class TypeEntity extends CustomEntity implements IProductType {
  @ManyToOne(() => ImageList, (el) => el.id)
  @JoinColumn({
    name: 'listId',
  })
  images: ImageList;
  @Column()
  listId: number;

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
