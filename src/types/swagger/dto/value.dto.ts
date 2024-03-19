import { ApiProperty } from '@nestjs/swagger';
import { adminRouter } from 'shared/routes';
import { z } from 'zod';

const { scheme } = adminRouter.prototype.current.value.create;

type CreateValueSchemeType = z.infer<typeof scheme>;

export class CreateValueDto implements CreateValueSchemeType {
  @ApiProperty({ example: 'interier', description: 'Property value (ru)' })
  value: string;
}
