import { ApiProperty } from '@nestjs/swagger';
import { ICharacteristic, ICharacteristicFull } from 'shared/types';
import { BaseScheme } from './base.scheme';
import { DictionarySwaggerScheme } from './dictionary.scheme';

export class CharacteristicSwaggerScheme
  extends BaseScheme
  implements ICharacteristic
{
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
  suffixId: number;

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

export class CharacteristicFullSwaggerScheme
  extends CharacteristicSwaggerScheme
  implements ICharacteristicFull
{
  @ApiProperty()
  name: DictionarySwaggerScheme;
  @ApiProperty()
  suffix: DictionarySwaggerScheme;
}
