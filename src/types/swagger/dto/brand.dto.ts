import { ApiProperty } from '@nestjs/swagger';
import { adminRouter } from 'shared/routes';
import { z } from 'zod';

const {
  brand: {
    create: { scheme: createScheme },
    getAll: { scheme: getAllScheme },
  },
} = adminRouter;

export type CreateBrandSchemeType = z.infer<typeof createScheme>;
export type GetBrandsSchemeType = z.infer<typeof getAllScheme>;

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

export class GetAllBrandsDto implements GetBrandsSchemeType {
  @ApiProperty({
    description: 'page number',
    default: '1',
    required: false,
  })
  page: number;

  @ApiProperty({
    description: 'items per page',
    default: '10',
    required: false,
  })
  perPage: number;

  @ApiProperty({
    description: '',
    required: false,
  })
  searchValue: string;
}
