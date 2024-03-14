import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CharacteristicValue } from 'database';
import { Repository } from 'typeorm';

@Injectable()
export class CharacteristicValueService {
  constructor(
    @InjectRepository(CharacteristicValue)
    private valueRepository: Repository<CharacteristicValue>,
  ) {}

  async setValue({ value, ...props }: CreationValueProps) {
    let entity = await this.valueRepository.findOneBy(props);
    if (!entity) {
      entity = this.valueRepository.create({ ...props, value });
    } else {
      entity.value = value;
    }

    try {
      await this.valueRepository.save(entity);
    } catch (error) {
      throw new HttpException(error.detail, HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
};
