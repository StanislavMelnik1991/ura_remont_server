import { ApiProperty } from '@nestjs/swagger';
import { apiRouter } from 'shared/routes';
import { z } from 'zod';

const {
  auth: { scheme },
} = apiRouter;

type AuthSchemeType = z.infer<typeof scheme>;

export class AuthDto implements AuthSchemeType {
  @ApiProperty({ example: 'Admin' })
  login: string;

  @ApiProperty({ example: '123qweQWE' })
  password: string;
}
