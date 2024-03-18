import { ApiProperty } from '@nestjs/swagger';
import { ICharacteristic } from 'shared/types';
import { BaseScheme } from './base.scheme';

export class CharacteristicSwaggerScheme
  extends BaseScheme
  implements ICharacteristic
{
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
  suffix: number;

  @ApiProperty({
    description: 'type Id',
    example: 1,
    required: true,
  })
  typeId: number;

  @ApiProperty({
    description: 'is characteristic used like filter',
    example: false,
    required: true,
  })
  isFilter: boolean;

  @ApiProperty({
    description: 'is characteristic displayed',
    example: false,
    required: true,
  })
  display: boolean;
}
