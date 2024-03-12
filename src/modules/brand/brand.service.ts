import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand, Dictionary } from 'database';
import { AcceptedLanguagesEnum } from 'shared/constants';
import { Repository, DataSource, UpdateResult } from 'typeorm';

@Injectable()
export class BrandService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    @InjectRepository(Dictionary)
    private dictionaryRepository: Repository<Dictionary>,
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
      const newBrand = queryRunner.manager.create(Brand, {
        name: savedName.id,
        description: savedDescription.id,
      });
      await queryRunner.manager.save(Brand, newBrand);

      await queryRunner.commitTransaction();
      return { id: newBrand.id };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  async update({ description, name, id }: UpdateProps) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const brand = await queryRunner.manager.findOneBy(Brand, { id });
      if (!brand) {
        throw new HttpException({ brand: 'not found' }, HttpStatus.NOT_FOUND);
      }
      const { name: nameId, description: descriptionId } = brand;
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
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }
  async getBrand(id: number) {
    const brand = await this.brandRepository.findOneBy({ id });
    if (!brand) {
      throw new HttpException({ brand: 'not found' }, HttpStatus.NOT_FOUND);
    }
    const { name: nameId, description: descriptionId, image } = brand;

    const [name, description] = await Promise.all([
      this.dictionaryRepository.findOneBy({ id: nameId }),
      this.dictionaryRepository.findOneBy({
        id: descriptionId,
      }),
    ]);

    return {
      id,
      name,
      description,
      image,
    };
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
