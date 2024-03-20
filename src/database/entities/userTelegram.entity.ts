import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { CustomEntity } from './base.entity';
import { IUserTelegram } from 'shared/types';
import { User } from './user.entity';

@Entity('users_telegram')
export class UserTelegram extends CustomEntity implements IUserTelegram {
  @OneToOne(() => User, (el) => el.id)
  @JoinColumn({
    name: 'userId',
  })
  @Column()
  userId: number;

  @Column({ nullable: false })
  telegramId: number;

  @Column({ nullable: true })
  auth_date: Date;
  @Column({ nullable: true })
  first_name: string;
  @Column({ nullable: true })
  username: string;
  @Column({ nullable: true })
  photo_url: string;
}
