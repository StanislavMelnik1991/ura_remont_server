import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserTelegram } from 'database';
import { Repository } from 'typeorm';
import { RolesEnum } from 'shared/constants';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserTelegram)
    private telegramRepository: Repository<UserTelegram>,
  ) {}

  async telegramAuth({ id, ...props }: AuthTgProps) {
    const existed = await this.telegramRepository.findOneBy({
      telegramId: Number(id),
    });
    if (existed) {
      const user = await this.userRepository.findOneBy({ id: existed.userId });
      if (!user) {
        throw new InternalServerErrorException();
      }
      Logger.log(`${props.username} in logging`, 'auth');
      return this.generateToken(user);
    } else {
      Logger.log(`New user ${props.username}`, 'auth');
      const user = this.userRepository.create({
        role: id === process.env.ADMIN_ID_TG ? RolesEnum.ADMIN : RolesEnum.USER,
        name: props.first_name || props.username,
      });
      if (id === process.env.ADMIN_ID_TG) {
        user.role = RolesEnum.ADMIN;
      }
      await this.userRepository.save(user);
      const userTelegram = this.telegramRepository.create({
        ...props,
        telegramId: Number(id),
        userId: user.id,
      });
      await this.telegramRepository.save(userTelegram);
      return this.generateToken(user);
    }
  }
  /* async login({ login, password }: AuthProps) {
    const entity = await this.userRepository.findOneBy({ login: login });
    if (!entity) {
      throw new HttpException(
        { authorization: 'incorrect login or password' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const comparePassword = compareSync(password, entity.password);
    if (!comparePassword) {
      throw new HttpException(
        { authorization: 'incorrect login or password' },
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.generateToken(entity);
  } */

  verifyUser(token: string) {
    return this.jwtService.verify<JwtPayloadType>(token);
  }

  async changeRole({ id, role }: ChangeRoleProps) {
    try {
      await this.userRepository.update({ id }, { role });
      return { id };
    } catch (error) {
      throw new HttpException(
        'INTERNAL_SERVER_ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async generateToken({ id, name }: User) {
    const payload: JwtPayloadType = { id, name };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async deleteUser(id: number) {
    await this.userRepository.delete({ id });
  }
  async deleteUserTelegram(id: number) {
    const telegram = await this.telegramRepository.findOneBy({ id });
    if (!telegram) {
      throw new NotFoundException();
    }
    await this.telegramRepository.delete({ id });
    await this.userRepository.delete({ id: telegram?.userId });
  }

  findById(id: number) {
    return this.userRepository.findOneBy({ id });
  }
}

type JwtPayloadType = { id: number; name: string };

type ChangeRoleProps = {
  id: number;
  role: RolesEnum;
};

type AuthTgProps = {
  id: string;
  first_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: string;
  hash: string;
};
