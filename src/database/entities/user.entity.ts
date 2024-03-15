import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RolesEnum } from 'shared/constants';
import { UserSchemeType } from 'shared/schemas';

@Entity('users')
export class User implements UserSchemeType {
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

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
