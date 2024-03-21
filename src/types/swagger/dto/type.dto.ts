import { ApiProperty } from '@nestjs/swagger';
import { adminRouter } from 'shared/routes';
import { z } from 'zod';

const {
  create: { scheme: createScheme },
  getAll: { scheme: getAllScheme },
} = adminRouter.type;

export type CreateTypeSchemeType = z.infer<typeof createScheme>;
export type GetAllTypesSchemeType = z.infer<typeof getAllScheme>;

export class CreateTypeDto implements CreateTypeSchemeType {
  @ApiProperty({
    example: 'Paint',
    description: 'Type name (ru)',
    required: true,
  })
  name: string;

  @ApiProperty({
    description: 'Type description (ru)',
    required: false,
  })
  description: string;
}

export class GetAllTypeSDto implements GetAllTypesSchemeType {
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
