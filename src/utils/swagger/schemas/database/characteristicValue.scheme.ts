import { ApiProperty } from '@nestjs/swagger';
import { ICharacteristicValue } from 'shared/types';
import { BaseScheme } from './base.scheme';

export class CharacteristicValueSwaggerScheme
  extends BaseScheme
  implements ICharacteristicValue
{
  @ApiProperty({
    description: 'prototype Id',
    example: 1,
    required: true,
  })
  prototypeId: number;

  @ApiProperty({
    description: 'characteristic Id',
    example: 1,
    required: true,
  })
  characteristicId: number;

  @ApiProperty({
    description: 'characteristic value',
    required: true,
  })
  value: string;
}
