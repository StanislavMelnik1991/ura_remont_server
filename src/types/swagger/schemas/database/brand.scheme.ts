import { ApiProperty } from '@nestjs/swagger';
import { IBrand } from 'shared/types';
import { BaseScheme } from './base.scheme';
import { DictionarySwaggerScheme } from './dictionary.scheme';

export class BrandSwaggerSchema extends BaseScheme implements IBrand {
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
}

export class BrandFullSwaggerSchema extends BaseScheme {
  @ApiProperty()
  name: DictionarySwaggerScheme;

  @ApiProperty()
  description: DictionarySwaggerScheme;
}

export class GetManyBrandsSwaggerScheme {
  @ApiProperty({ example: 1 })
  total: number;
  @ApiProperty({ isArray: true })
  data: BrandFullSwaggerSchema;
}
