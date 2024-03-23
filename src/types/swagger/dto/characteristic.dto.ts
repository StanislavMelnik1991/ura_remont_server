import { ApiProperty } from '@nestjs/swagger';
import { characteristicCreateScheme } from 'shared/schemas';
import { z } from 'zod';

type CreateCharacteristicSchemeType = z.infer<
  typeof characteristicCreateScheme
>;

export class CreateCharacteristicDto implements CreateCharacteristicSchemeType {
  @ApiProperty({
    example: 'Consumption',
    description: 'Property name (ru)',
  })
  name: string;

  @ApiProperty({ example: 'l/m²', description: 'Property suffix (ru)' })
  suffix: string;

  @ApiProperty({
    example: true,
    description: 'Whether this property is shown in the filter list',
  })
  isFilter: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether this property is shown in the product properties',
  })
  display: boolean;

  @ApiProperty()
  typeId: number;
}
