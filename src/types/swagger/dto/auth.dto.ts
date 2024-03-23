import { ApiProperty } from '@nestjs/swagger';
import { authTelegramScheme } from 'shared/schemas';
import { z } from 'zod';

type TgAuthSchemeType = z.infer<typeof authTelegramScheme>;

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
