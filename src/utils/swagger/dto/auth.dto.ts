import { ApiProperty } from '@nestjs/swagger';
import { AuthSchemeType } from 'shared/schemas';

export class AuthDto implements AuthSchemeType {
  @ApiProperty({ example: 'Admin' })
  login: string;

  @ApiProperty({ example: '123qweQWE' })
  password: string;
}
