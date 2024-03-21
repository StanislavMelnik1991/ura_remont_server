import { ApiProperty } from '@nestjs/swagger';
import { apiRouter } from 'shared/routes';
import { z } from 'zod';

const {
  auth: {
    scheme,
    telegram: { scheme: tgScheme },
  },
} = apiRouter;

type AuthSchemeType = z.infer<typeof scheme>;
type TgAuthSchemeType = z.infer<typeof tgScheme>;

export class AuthDto implements AuthSchemeType {
  @ApiProperty({ example: 'Admin' })
  login: string;

  @ApiProperty({ example: '123qweQWE' })
  password: string;
}

export class TelegramAuthDto implements TgAuthSchemeType {
  @ApiProperty({ example: String(Date.now()) })
  auth_date: string;

  @ApiProperty({ example: 'Admin' })
  first_name: string;

  @ApiProperty({ example: 'Admin' })
  username: string;

  @ApiProperty({ example: '1b0b33fe5' })
  hash: string;

  @ApiProperty({ example: '1000' })
  id: string;

  @ApiProperty({ example: 'https://t.me/i/userpic/320/ubTrf.jpg' })
  photo_url: string;
}
