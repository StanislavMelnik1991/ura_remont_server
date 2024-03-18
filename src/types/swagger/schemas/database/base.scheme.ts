import { ApiProperty } from '@nestjs/swagger';

export class BaseScheme {
  @ApiProperty({
    description: 'ID',
    example: 1,
    required: true,
  })
  id: number;

  @ApiProperty({
    description: 'creation date',
    example: new Date(),
    required: true,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'updating date',
    example: new Date(),
    required: false,
  })
  updatedAt: Date;
}
