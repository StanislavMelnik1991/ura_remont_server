import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'database';
import { Repository } from 'typeorm';
import { compareSync, hash } from 'bcryptjs';
import { RolesEnum } from 'shared/constants';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create({ login, password }: AuthProps) {
    const HASH_ROUNDS = Number(process.env.HASH_ROUNDS);
    try {
      const hashPassword = await hash(password, HASH_ROUNDS);
      const entity = this.userRepository.create({
        login,
        password: hashPassword,
      });
      console.log(hashPassword);
      await this.userRepository.save(entity);
      return this.generateToken(entity);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        { authorization: 'something wrong' },
        HttpStatus.CONFLICT,
      );
    }
  }

  async login({ login, password }: AuthProps) {
    const entity = await this.userRepository.findOneBy({ login: login });
    if (!entity) {
      throw new HttpException(
        { authorization: 'something wrong' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const comparePassword = compareSync(password, entity.password);
    if (!comparePassword) {
      throw new HttpException(
        { authorization: 'something wrong' },
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.generateToken(entity);
  }

  verifyUser(token: string) {
    return this.jwtService.verify<JwtPayloadType>(token);
  }

  async generateToken({ id, role }: User) {
    const payload: JwtPayloadType = { id, role };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}

type AuthProps = {
  login: string;
  password: string;
};

type JwtPayloadType = { id: number; role: RolesEnum };
