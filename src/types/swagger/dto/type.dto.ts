import { ApiProperty } from '@nestjs/swagger';
import { adminRouter } from 'shared/routes';
import { z } from 'zod';

const { scheme } = adminRouter.type.create;

type CreateTypeSchemeType = z.infer<typeof scheme>;

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
