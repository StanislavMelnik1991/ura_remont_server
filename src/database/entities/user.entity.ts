import { Column, Entity } from 'typeorm';
import { RolesEnum } from 'shared/constants';
import { CustomEntity } from './base.entity';
import { IUser } from 'shared/types';

@Entity('users')
export class User extends CustomEntity implements IUser {
  @Column({ enum: RolesEnum, default: RolesEnum.USER })
  role: RolesEnum;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  signupToken: string;

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ default: new Date() })
  lastRequest: Date;
}
