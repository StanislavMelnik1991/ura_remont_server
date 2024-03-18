import { ApiProperty } from '@nestjs/swagger';
import { BaseScheme } from './base.scheme';
import { IProductType } from 'shared/types';

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
