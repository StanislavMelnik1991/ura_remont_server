import { ApiProperty } from '@nestjs/swagger';
import { brandCreateScheme, brandGetAllScheme } from 'shared/schemas';
import { z } from 'zod';

export type CreateBrandSchemeType = z.infer<typeof brandCreateScheme>;
export type GetBrandsSchemeType = z.infer<typeof brandGetAllScheme>;

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
