import { ApiProperty } from '@nestjs/swagger';
import { BaseScheme } from './base.scheme';
import { IProduct } from 'shared/types';

export class ProductScheme extends BaseScheme implements IProduct {
  @ApiProperty({ example: 1 })
  prototypeId: number;

  @ApiProperty({ description: '1c ID', example: 'XD123321XO' })
  externalId: string;
  @ApiProperty({ description: '1c name', example: 'Amphibolin 10л база1' })
  externalName?: string;

  @ApiProperty({ example: 1 })
  availableQuantity: number;
  @ApiProperty({ example: 225.99 })
  price: number;
  @ApiProperty({ example: 0 })
  soldQuantity: number;
  @ApiProperty({ example: 0 })
  pendingQuantity: number;
}

export type ProductSchemeType = {
  [P in keyof ProductScheme]: ProductScheme[P];
};
