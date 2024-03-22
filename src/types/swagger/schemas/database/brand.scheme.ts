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
export class LocalizedBrandSwaggerSchema extends BaseScheme {
  @ApiProperty()
  name: string;

  @ApiProperty({
    required: false,
  })
  description: string;
}

export class AdminBrandSwaggerSchema extends BaseScheme {
  @ApiProperty()
  name: DictionarySwaggerScheme;

  @ApiProperty()
  description: DictionarySwaggerScheme;
}
