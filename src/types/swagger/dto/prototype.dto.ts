import { ApiProperty } from '@nestjs/swagger';
import { prototypeCreateScheme } from 'shared/schemas';
import { z } from 'zod';

type CreatePrototypeSchemeType = z.infer<typeof prototypeCreateScheme>;

export class CreatePrototypeDto implements CreatePrototypeSchemeType {
  @ApiProperty({
    example: 'Amphibolin',
    description: 'Name of production',
    required: true,
  })
  name: string;

  @ApiProperty({
    example: 'best pain',
    description: 'Production description',
    required: false,
  })
  description: string;

  @ApiProperty({ example: 1, description: 'Brand ID' })
  brandId: number;

  @ApiProperty({ example: 1, description: 'Type ID' })
  typeId: number;
}
