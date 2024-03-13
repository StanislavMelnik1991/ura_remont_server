import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PropertyValue } from 'database/entities/propertyValue.entity';
import { PropertyService } from 'modules/property/property.service';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PropertyValueService {
  constructor(
    private dataSource: DataSource,
    private propertyService: PropertyService,

    @InjectRepository(PropertyValue)
    private valueRepository: Repository<PropertyValue>,
  ) {}

  async createValue({ productId, propertyId, value }: CreationValueProps) {
    const queryRunner = this.dataSource.createQueryRunner();
    await this.propertyService.findByIdOrFail(propertyId);
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { manager } = queryRunner;
      const entity = manager.create(PropertyValue, {
        productId,
        propertyId,
        value,
      });
      await manager.save(PropertyValue, entity);

      await queryRunner.commitTransaction();
      return { id: entity.id };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
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
