import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Dictionary } from './dictionary.entity';
import { CustomEntity } from './base.entity';
import { IBrand } from 'shared/types';
import { ImageList } from './imageList.entity';

@Entity('brands')
export class Brand extends CustomEntity implements IBrand {
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
