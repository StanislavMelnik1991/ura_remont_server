import { ApiProperty } from '@nestjs/swagger';
import { adminRouter } from 'shared/routes';
import { z } from 'zod';

const { scheme } = adminRouter.prototype.create;

type CreatePrototypeSchemeType = z.infer<typeof scheme>;

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
