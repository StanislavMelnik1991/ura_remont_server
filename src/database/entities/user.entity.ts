import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { RolesEnum } from 'shared/constants';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  login: string;

  @Column()
  password: string;

  @Column({ enum: RolesEnum, default: RolesEnum.USER })
  role: RolesEnum;

  @Column({ nullable: true })
  signupToken: string;

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ default: new Date() })
  lastRequest: Date;
}
