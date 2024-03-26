import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Dictionary } from './dictionary.entity';
import { CustomEntity } from './base.entity';
import { IBrand } from 'shared/types';
import { ImageList } from './imageList.entity';

@Entity('brands')
export class Brand extends CustomEntity implements IBrand {
  @OneToOne(() => ImageList)
  @JoinColumn({ name: 'listId' })
  images: ImageList;
  @Column()
  listId: number;

  @OneToOne(() => Dictionary)
  @JoinColumn({ name: 'nameId' })
  name: Dictionary;
  @Column({ nullable: false })
  nameId: number;

  @OneToOne(() => Dictionary)
  @JoinColumn({ name: 'descriptionId' })
  description: Dictionary;
  @Column()
  descriptionId: number;
}
