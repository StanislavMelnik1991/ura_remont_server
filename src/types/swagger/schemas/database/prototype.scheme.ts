import { ApiProperty } from '@nestjs/swagger';
import { BaseScheme } from './base.scheme';
import { IPrototype } from 'shared/types';

export class PrototypeSwaggerScheme extends BaseScheme implements IPrototype {
  @ApiProperty({ example: 1 })
  brandId: number;

  @ApiProperty({ example: 1 })
  typeId: number;

  @ApiProperty({ example: 'Amphibolin' })
  nameId: number;

  @ApiProperty({ example: 'универсальная акрилатная краска' })
  descriptionId: number;
}
