import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CharacteristicValue } from 'database';
import { IUser } from 'shared/types';
import { Repository } from 'typeorm';

@Injectable()
export class CharacteristicValueService {
  constructor(
    @InjectRepository(CharacteristicValue)
    private valueRepository: Repository<CharacteristicValue>,
  ) {}

  async create({ user, value, ...props }: CreationValueProps) {
    let entity = await this.valueRepository.findOneBy(props);
    if (!entity) {
      entity = this.valueRepository.create({ ...props, value });
    } else {
      entity.value = value;
    }

    try {
      await this.valueRepository.save(entity);
    } catch (error) {
      Logger.error('INTERNAL_SERVER_ERROR', 'CharacteristicValue');
      throw new InternalServerErrorException();
    }
    Logger.log(
      `user with id: ${user.id} create new CharacteristicValue with id: ${entity.id}`,
      'CharacteristicValue',
    );
    return { id: entity.id };
  }

  findByPrototypeAndCharacteristic(props: {
    prototypeId: number;
    characteristicId: number;
  }) {
    return this.valueRepository.findOneBy(props);
  }
}

type CreationValueProps = {
  characteristicId: number;
  prototypeId: number;
  value: string;
  user: IUser;
};
