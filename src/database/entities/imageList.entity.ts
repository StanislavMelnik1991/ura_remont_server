import { Entity, OneToMany } from 'typeorm';
import { CustomEntity } from './base.entity';
import { ImageEntity } from './image.entity';

@Entity('image_lists')
export class ImageList extends CustomEntity {
  @OneToMany(() => ImageEntity, (el) => el.image)
  images: Array<string>;
}
