import { ApiProperty } from '@nestjs/swagger';
import { BaseScheme } from './base.scheme';
import { IProductType } from 'shared/types';
import { DictionarySwaggerScheme } from './dictionary.scheme';

export class TypeSwaggerScheme extends BaseScheme implements IProductType {
  @ApiProperty({
    description: 'dictionary Id',
    example: 1,
    required: true,
  })
  name: number;

  @ApiProperty({
    description: 'dictionary Id',
    example: 1,
    required: false,
  })
  description: number;
}
export class LocalizedTypeSwaggerSchema extends BaseScheme {
  @ApiProperty()
  name: string;

  @ApiProperty({
    required: false,
  })
  description: string;
}

export class AdminTypeSwaggerSchema extends BaseScheme {
  @ApiProperty()
  name: DictionarySwaggerScheme;

  @ApiProperty()
  description: DictionarySwaggerScheme;
}
