import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CharacteristicValue } from 'database';
import { CharacteristicService } from 'modules/characteristic/characteristic.service';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CharacteristicValueService {
  constructor(
    private dataSource: DataSource,
    private characteristicService: CharacteristicService,

    @InjectRepository(CharacteristicValue)
    private ValueRepository: Repository<CharacteristicValue>,
  ) {}

  async createValue({
    characteristicId,
    prototypeId,
    value,
  }: CreationValueProps) {
    const queryRunner = this.dataSource.createQueryRunner();
    await this.characteristicService.findById(characteristicId);
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { manager } = queryRunner;
      const entity = manager.create(CharacteristicValue, {
        characteristicId,
        prototypeId,
        value,
      });
      await manager.save(CharacteristicValue, entity);

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
    prototypeId: number;
    characteristicId: number;
  }) {
    return this.ValueRepository.findOneBy(props);
  }
}

type CreationValueProps = {
  characteristicId: number;
  prototypeId: number;
  value: string;
};
