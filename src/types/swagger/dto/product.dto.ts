import { ApiProperty } from '@nestjs/swagger';
import { productCreateScheme, productUpdateScheme } from 'shared/schemas';
import { z } from 'zod';

type CreateType = z.infer<typeof productCreateScheme>;
type UpdateType = z.infer<typeof productUpdateScheme>;

export class CreateProductDto implements CreateType {
  @ApiProperty({
    example: 1,
    description: 'Id of prototype reference',
    required: true,
  })
  prototypeId: number;

  @ApiProperty({
    example: 'TD99AS8',
    description: '1c ID',
    required: true,
  })
  externalId: string;

  @ApiProperty({
    example: 'Amphibolin b1 10l',
    description: '1c name',
    required: false,
  })
  externalName: string;

  @ApiProperty({
    example: 10,
    required: true,
  })
  availableQuantity: number;

  @ApiProperty({
    example: 100.99,
    required: true,
  })
  price: number;
}

export class UpdateProductDto implements UpdateType {
  @ApiProperty({
    example: 'TD99AS8',
    description: '1c ID',
    required: false,
  })
  externalId: string;

  @ApiProperty({
    example: 'Amphibolin b1 10l',
    description: '1c name',
    required: false,
  })
  externalName: string;

  @ApiProperty({
    example: 10,
    required: false,
  })
  availableQuantity: number;

  @ApiProperty({
    example: 100.99,
    required: false,
  })
  price: number;
}
