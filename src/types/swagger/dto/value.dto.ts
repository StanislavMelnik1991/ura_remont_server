import { ApiProperty } from '@nestjs/swagger';
import { CreateValueSchemeType } from 'shared/schemas';

export class CreateValueDto implements CreateValueSchemeType {
  @ApiProperty({ example: 'interier', description: 'Property value (ru)' })
  value: string;
}
