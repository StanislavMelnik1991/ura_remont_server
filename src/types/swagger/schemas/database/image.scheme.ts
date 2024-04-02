import { ApiProperty } from '@nestjs/swagger';
import { BaseScheme } from './base.scheme';

export class ImageInterface extends BaseScheme {
  @ApiProperty()
  image: string;
  @ApiProperty()
  filePath: string;
  @ApiProperty()
  listId: number;
  @ApiProperty()
  index: number;
}

export class ImageListInterface extends BaseScheme {
  @ApiProperty({ isArray: true })
  images: ImageInterface;
}
