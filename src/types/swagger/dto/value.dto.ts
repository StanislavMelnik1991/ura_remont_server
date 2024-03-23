import { ApiProperty } from '@nestjs/swagger';
import {
  characteristicValueCreateScheme,
  propertyValueCreateScheme,
} from 'shared/schemas';
import { z } from 'zod';

type CreateValueSchemeType = z.infer<typeof propertyValueCreateScheme>;

export class CreatePropertyValueDto implements CreateValueSchemeType {
  @ApiProperty({ example: 'interier', description: 'Property value (ru)' })
  value: string;
  @ApiProperty()
  productId: number;
  @ApiProperty()
  propertyId: number;
}

type CreateCharacteristicValueSchemeType = z.infer<
  typeof characteristicValueCreateScheme
>;

export class CreateCharacteristicValueDto
  implements CreateCharacteristicValueSchemeType
{
  @ApiProperty({ example: 'interier', description: 'Property value (ru)' })
  value: string;
  @ApiProperty()
  characteristicId: number;
  @ApiProperty()
  prototypeId: number;
}
