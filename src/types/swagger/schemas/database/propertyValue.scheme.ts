import { ApiProperty } from '@nestjs/swagger';
import { BaseScheme } from './base.scheme';
import { IPropertyValue } from 'shared/types';

export class PropertyValueSwaggerScheme
  extends BaseScheme
  implements IPropertyValue
{
  @ApiProperty({
    description: 'prototype Id',
    example: 1,
    required: true,
  })
  productId: number;

  @ApiProperty({
    description: 'property Id',
    example: 1,
    required: true,
  })
  propertyId: number;

  @ApiProperty({
    description: 'property value',
    required: true,
  })
  value: string;
}
