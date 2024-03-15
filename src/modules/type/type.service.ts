import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dictionary, ProductType } from 'database';
import { CharacteristicService } from 'modules/characteristic/characteristic.service';
import { DictionaryService } from 'modules/dictionary/dictionary.service';
import { AcceptedLanguagesEnum } from 'shared/constants';
import { Repository, DataSource, UpdateResult } from 'typeorm';

@Injectable()
export class TypeService {
  constructor(
    private dataSource: DataSource,
    private characteristicService: CharacteristicService,
    private dictionaryService: DictionaryService,

    @InjectRepository(ProductType)
    private typeRepository: Repository<ProductType>,
  ) {}
  async create({ description, name }: CreationProps) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newName = queryRunner.manager.create(Dictionary, {
        ru: name,
      });
      const newDescription = queryRunner.manager.create(Dictionary, {
        ru: description,
      });
      const [savedName, savedDescription] = await Promise.all([
        queryRunner.manager.save(Dictionary, newName),
        queryRunner.manager.save(Dictionary, newDescription),
      ]);
      const newType = queryRunner.manager.create(ProductType, {
        name: savedName.id,
        description: savedDescription.id,
      });
      await queryRunner.manager.save(ProductType, newType);

      await queryRunner.commitTransaction();
      return { id: newType.id };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(err.detail, HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  async update({ description, name, id }: UpdateProps) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const productType = await queryRunner.manager.findOneBy(ProductType, {
        id,
      });
      if (!productType) {
        throw new HttpException({ type: 'not found' }, HttpStatus.NOT_FOUND);
      }
      const { name: nameId, description: descriptionId } = productType;
      const jobs: Array<Promise<UpdateResult>> = [];
      if (name) {
        jobs.push(
          queryRunner.manager.update(Dictionary, { id: nameId }, { ...name }),
        );
      }
      if (description) {
        jobs.push(
          queryRunner.manager.update(
            Dictionary,
            { id: descriptionId },
            { ...description },
          ),
        );
      }
      await Promise.all(jobs);

      await queryRunner.commitTransaction();

      return { id };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (err instanceof HttpException) {
        throw new HttpException(err.getResponse(), err.getStatus());
      }
      throw new HttpException(err.detail, HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  getType(id: number) {
    return this.findByIdOrFail(id);
  }

  findProperties(typeId: number) {
    return this.characteristicService.findByTypeId(typeId);
  }
  async findByIdOrFail(id: number) {
    try {
      return await this.typeRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new HttpException({ type: 'not found' }, HttpStatus.NOT_FOUND);
    }
  }
}

type CreationProps = {
  name: string;
  description?: string;
};

type UpdateProps = {
  name?: Partial<Record<AcceptedLanguagesEnum, string>>;
  description?: Partial<Record<AcceptedLanguagesEnum, string>>;
  id: number;
};
