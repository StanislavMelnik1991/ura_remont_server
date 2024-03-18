import { ApiProperty } from '@nestjs/swagger';
import { IBrand } from 'shared/types';
import { BaseScheme } from './base.scheme';

export class BrandSwaggerSchema extends BaseScheme implements IBrand {
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
