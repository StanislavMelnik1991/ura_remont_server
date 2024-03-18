import { ApiProperty } from '@nestjs/swagger';
import { BaseScheme } from './base.scheme';
import { RolesEnum } from 'shared/constants';
import { IUser } from 'shared/types';

export class UserSwaggerScheme extends BaseScheme implements IUser {
  @ApiProperty({ example: 'Admin' })
  login: string;

  @ApiProperty({ example: '123qweQWE' })
  password: string;

  @ApiProperty({ example: RolesEnum.USER })
  role: RolesEnum;

  @ApiProperty()
  signupToken: string;

  @ApiProperty()
  resetPasswordToken: string;

  @ApiProperty({ example: new Date() })
  lastRequest: Date;
}
