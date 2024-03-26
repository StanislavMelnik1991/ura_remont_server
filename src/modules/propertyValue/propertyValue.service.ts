import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PropertyValue } from 'database';
import { IUser } from 'shared/types';
import { Repository } from 'typeorm';

@Injectable()
export class PropertyValueService {
  constructor(
    @InjectRepository(PropertyValue)
    private valueRepository: Repository<PropertyValue>,
  ) {}

  async create({ value, user, ...props }: CreationValueProps) {
    const existed = await this.valueRepository.findOneBy(props);
    if (!existed) {
      const entity = this.valueRepository.create({ ...props, value });
      await this.valueRepository.save(entity);
      Logger.log(
        `user id: ${user.id} create new property value`,
        'PropertyValue',
      );
      return { id: entity.id };
    } else {
      existed.value = value;
      Logger.log(
        `user id: ${user.id} update property value id: ${existed.id}`,
        'PropertyValue',
      );
    }
    try {
      await this.valueRepository.save(existed);
    } catch (error) {
      Logger.error(`InternalServerErrorException`, 'PropertyValue');
      throw new InternalServerErrorException();
    }
    return { id: existed.id };
  }

  findByPrototypeAndCharacteristic(props: {
    productId: number;
    propertyId: number;
  }) {
    return this.valueRepository.findOneBy(props);
  }
}

type CreationValueProps = {
  productId: number;
  propertyId: number;
  value: string;
  user: IUser;
};
