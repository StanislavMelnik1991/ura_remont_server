import { ApiProperty } from '@nestjs/swagger';
import { CreateTypeSchemeType } from 'shared/schemas';

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
