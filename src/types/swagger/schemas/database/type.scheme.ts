import { ApiProperty } from '@nestjs/swagger';
import { BaseScheme } from './base.scheme';
import { IProductType } from 'shared/types';
import { DictionarySwaggerScheme } from './dictionary.scheme';
import { CharacteristicFullSwaggerScheme } from './characteristic.scheme';
import { ImageListInterface } from './image.scheme';

export class TypeSwaggerScheme extends BaseScheme implements IProductType {
  @ApiProperty({
    description: 'dictionary Id',
    example: 1,
    required: true,
  })
  nameId: number;

  @ApiProperty({
    description: 'dictionary Id',
    example: 1,
    required: false,
  })
  descriptionId: number;

  @ApiProperty({
    description: 'images list Id',
    example: 1,
    required: false,
  })
  listId: number;
}

export class TypeFullSwaggerScheme extends TypeSwaggerScheme {
  @ApiProperty()
  description: DictionarySwaggerScheme;
  @ApiProperty()
  name: DictionarySwaggerScheme;
  @ApiProperty({ isArray: true })
  characteristics: CharacteristicFullSwaggerScheme;
  @ApiProperty()
  images: ImageListInterface;
}

export class GetManyTypesSwaggerScheme {
  @ApiProperty({ example: 1 })
  total: number;
  @ApiProperty({ isArray: true })
  data: TypeFullSwaggerScheme;
}
