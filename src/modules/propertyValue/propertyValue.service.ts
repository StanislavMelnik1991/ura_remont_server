import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PropertyValue } from 'database';
import { Repository } from 'typeorm';

@Injectable()
export class PropertyValueService {
  constructor(
    @InjectRepository(PropertyValue)
    private valueRepository: Repository<PropertyValue>,
  ) {}

  async create({ value, ...props }: CreationValueProps) {
    let entity = await this.valueRepository.findOneBy(props);
    if (!entity) {
      entity = this.valueRepository.create({ ...props, value });
    } else {
      entity.value = value;
    }

    try {
      await this.valueRepository.save(entity);
    } catch (error) {
      Logger.error(`InternalServerErrorException`, 'PropertyValue');
      throw new InternalServerErrorException();
    }
    return { id: entity.id };
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
};
