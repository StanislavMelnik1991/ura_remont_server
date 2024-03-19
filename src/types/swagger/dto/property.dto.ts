import { ApiProperty } from '@nestjs/swagger';
import { adminRouter } from 'shared/routes';
import { z } from 'zod';

const { scheme } = adminRouter.type.current.characteristic.create;

type CreatePropertySchemeType = z.infer<typeof scheme>;

export class CreatePropertyDto implements CreatePropertySchemeType {
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
}
