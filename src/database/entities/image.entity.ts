import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CustomEntity } from './base.entity';
import { IImage } from 'shared/types';
import { ImageList } from './imageList.entity';

@Entity('images')
export class ImageEntity extends CustomEntity implements IImage {
  @ManyToOne(() => ImageList, (el) => el.id)
  @JoinColumn({
    name: 'listId',
  })
  @Column()
  listId: number;

  @Column()
  image: string;

  @Column({ nullable: true })
  filePath: string;

  @Column({ nullable: true })
  index: number;
}
