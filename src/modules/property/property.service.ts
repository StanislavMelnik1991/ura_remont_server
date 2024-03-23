import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dictionary, PrototypeProperty } from 'database';
import { DictionaryService } from 'modules/dictionary/dictionary.service';
import { PropertyValueService } from 'modules/propertyValue/propertyValue.service';
import { IUser } from 'shared/types';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PropertyService {
  constructor(
    private dataSource: DataSource,

    private valueService: PropertyValueService,
    private dictionaryService: DictionaryService,

    @InjectRepository(PrototypeProperty)
    private propertyRepository: Repository<PrototypeProperty>,
  ) {}
  async create({
    name,
    suffix,
    prototypeId,
    display,
    isFilter,
    user,
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

      Logger.log(
        `user id: ${user.id} upload new Product id: ${entity.id}`,
        'PrototypeProperty',
      );
      return { id: entity.id };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      Logger.error(`InternalServerErrorException`, 'PrototypeProperty');
      throw new InternalServerErrorException();
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
      Logger.warn(`property not found`, 'PrototypeProperty');
      throw new NotFoundException({ property: 'not found' });
    }
  }
}

type CreationPropertyProps = {
  prototypeId: number;
  name: string;
  suffix: string;
  isFilter?: boolean;
  display?: boolean;
  user: IUser;
};
