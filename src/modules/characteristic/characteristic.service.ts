import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Characteristic, Dictionary, ProductType } from 'database';
import { DictionaryService } from 'modules/dictionary/dictionary.service';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class CharacteristicService {
  constructor(
    private dataSource: DataSource,

    private dictionaryService: DictionaryService,

    @InjectRepository(Characteristic)
    private characteristicRepository: Repository<Characteristic>,
  ) {}

  async create({
    name,
    suffix,
    typeId,
    display,
    isFilter,
  }: CreationPropertyProps) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { manager } = queryRunner;
      const notFound = !(await manager.findOneBy(ProductType, { id: typeId }));
      if (notFound) {
        throw new HttpException({ type: 'not found' }, HttpStatus.NOT_FOUND);
      }
      const newName = manager.create(Dictionary, {
        ru: name,
      });
      const newSuffix = manager.create(Dictionary, {
        ru: suffix,
      });
      const [savedName, savedSuffix] = await Promise.all([
        manager.save(Dictionary, newName),
        manager.save(Dictionary, newSuffix),
      ]);
      const entity = manager.create(Characteristic, {
        typeId,
        name: savedName.id,
        suffix: savedSuffix.id,
        display,
        isFilter,
      });
      await manager.save(Characteristic, entity);

      await queryRunner.commitTransaction();
      return { id: entity.id };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(err.detail, HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  findById(typeId: number) {
    return this.characteristicRepository.findBy({ typeId });
  }

  findByIdOrFail(id: number) {
    try {
      return this.characteristicRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new HttpException(
        { characteristic: 'not found' },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  findByTypeId(typeId: number) {
    return this.characteristicRepository.findBy({ typeId });
  }
}

type CreationPropertyProps = {
  typeId: number;
  name: string;
  suffix: string;
  isFilter?: boolean;
  display?: boolean;
};
