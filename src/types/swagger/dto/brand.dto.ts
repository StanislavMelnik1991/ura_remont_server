import { ApiProperty } from '@nestjs/swagger';
import { adminRouter } from 'shared/routes';
import { z } from 'zod';

const {
  brand: {
    create: { scheme },
  },
} = adminRouter;

type CreateBrandSchemeType = z.infer<typeof scheme>;

export class CreateBrandDto implements CreateBrandSchemeType {
  @ApiProperty({
    example: 'Caparol',
    description: 'Brand name (ru)',
    required: true,
  })
  name: string;

  @ApiProperty({
    description: 'Brand description (ru)',
    required: false,
  })
  description: string;
}
