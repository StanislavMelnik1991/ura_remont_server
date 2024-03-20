import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
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

  async create() {
    // const HASH_ROUNDS = Number(process.env.HASH_ROUNDS);
    try {
      /* const hashPassword = await hash(password, HASH_ROUNDS); */
      const entity = this.userRepository.create();
      await this.userRepository.save(entity);
      return this.generateToken(entity);
    } catch (error) {
      throw new HttpException(
        { authorization: 'something wrong' },
        HttpStatus.CONFLICT,
      );
    }
  }
  async telegramAuth({ id, ...props }: AuthTgProps) {
    const existed = await this.telegramRepository.findOneBy({ telegramId: id });
    if (existed) {
      const user = await this.userRepository.findOneBy({ id: existed.userId });
      if (!user) {
        throw new InternalServerErrorException();
      }
      return this.generateToken(user);
    } else {
      const user = this.userRepository.create({
        role:
          id === Number(process.env.ADMIN_ID_TG)
            ? RolesEnum.ADMIN
            : RolesEnum.USER,
        name: props.first_name || props.username,
      });
      if (id === Number(process.env.ADMIN_ID_TG)) {
        user.role = RolesEnum.ADMIN;
      }
      await this.userRepository.save(user);
      const userTelegram = this.telegramRepository.create({
        ...props,
        telegramId: id,
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

  async generateToken({ id, role }: User) {
    const payload: JwtPayloadType = { id, role };
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
}

type JwtPayloadType = { id: number; role: RolesEnum };

type ChangeRoleProps = {
  id: number;
  role: RolesEnum;
};

type AuthTgProps = {
  id: number;
  first_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: Date;
  hash: string;
};
