import { ApiProperty } from '@nestjs/swagger';
import { typeCreateScheme, typeGetAllScheme } from 'shared/schemas';
import { z } from 'zod';

export type CreateTypeSchemeType = z.infer<typeof typeCreateScheme>;
export type GetAllTypesSchemeType = z.infer<typeof typeGetAllScheme>;

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
