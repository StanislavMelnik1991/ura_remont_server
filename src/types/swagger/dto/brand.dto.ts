import { ApiProperty } from '@nestjs/swagger';
import { CreateBrandSchemeType } from 'shared/schemas';

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
