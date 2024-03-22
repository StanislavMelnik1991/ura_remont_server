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
    name: 'nameId',
  })
  name: Dictionary;
  @Column({ nullable: false })
  nameId: number;

  @ManyToOne(() => Dictionary, (dict) => dict.id)
  @JoinColumn({
    name: 'descriptionId',
  })
  description: Dictionary;
  @Column()
  descriptionId: number;
}
