import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dictionary, PrototypeProperty } from 'database';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PropertyService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(PrototypeProperty)
    private propertyRepository: Repository<PrototypeProperty>,
  ) {}
  async create({
    name,
    suffix,
    prototypeId,
    display,
    isFilter,
  }: CreationPropertyProps) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newName = queryRunner.manager.create(Dictionary, {
        ru: name,
      });
      const newSuffix = queryRunner.manager.create(Dictionary, {
        ru: suffix,
      });
      const [savedName, savedSuffix] = await Promise.all([
        queryRunner.manager.save(Dictionary, newName),
        queryRunner.manager.save(Dictionary, newSuffix),
      ]);
      const entity = queryRunner.manager.create(PrototypeProperty, {
        prototypeId,
        name: savedName.id,
        suffix: savedSuffix.id,
        display,
        isFilter,
      });
      await queryRunner.manager.save(PrototypeProperty, entity);

      await queryRunner.commitTransaction();
      return { id: entity.id };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }
  findByPrototypeId(prototypeId: number) {
    return this.propertyRepository.findBy({ prototypeId });
  }
  findByIdOrFail(id: number) {
    try {
      return this.propertyRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new HttpException(
        { property: 'not found' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

type CreationPropertyProps = {
  prototypeId: number;
  name: string;
  suffix: string;
  isFilter?: boolean;
  display?: boolean;
};
