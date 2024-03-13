import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand, Dictionary, ProductPrototype, ProductType } from 'database';
import { CharacteristicValueService } from 'modules/characteristicValues/characteristicValue.service';
import { PropertyService } from 'modules/property/property.service';
import { TypeService } from 'modules/type/type.service';
import { AcceptedLanguagesEnum } from 'shared/constants';
import { Repository, DataSource, UpdateResult } from 'typeorm';

@Injectable()
export class PrototypeService {
  constructor(
    private dataSource: DataSource,

    private propertyService: PropertyService,
    private characteristicValueService: CharacteristicValueService,
    private typeService: TypeService,

    @InjectRepository(ProductPrototype)
    private prototypeRepository: Repository<ProductPrototype>,

    @InjectRepository(Dictionary)
    private dictionaryRepository: Repository<Dictionary>,
  ) {}
  findByIdOrFail(id: number) {
    try {
      return this.prototypeRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new HttpException({ prototype: 'not found' }, HttpStatus.NOT_FOUND);
    }
  }
  async create({ description, name, brandId, typeId, image }: CreationProps) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const [brand, type] = await Promise.all([
        queryRunner.manager.findOneBy(Brand, { id: brandId }),
        queryRunner.manager.findOneBy(ProductType, { id: typeId }),
      ]);
      if (!brand) {
        throw new HttpException({ brand: 'not found' }, HttpStatus.NOT_FOUND);
      }
      if (!type) {
        throw new HttpException({ type: 'not found' }, HttpStatus.NOT_FOUND);
      }
      const newName = queryRunner.manager.create(Dictionary, {
        ru: name,
        be: name,
        en: name,
        pl: name,
        uk: name,
      });
      const newDescription = queryRunner.manager.create(Dictionary, {
        ru: description,
      });
      const [savedName, savedDescription] = await Promise.all([
        queryRunner.manager.save(Dictionary, newName),
        queryRunner.manager.save(Dictionary, newDescription),
      ]);
      const entity = queryRunner.manager.create(ProductPrototype, {
        name: savedName.id,
        description: savedDescription.id,
        image,
        brandId,
        typeId,
      });
      await queryRunner.manager.save(ProductPrototype, entity);

      await queryRunner.commitTransaction();
      return { id: entity.id };
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

  async update({ description, name, id }: UpdateProps) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entity = await queryRunner.manager.findOneBy(ProductPrototype, {
        id,
      });
      if (!entity) {
        throw new HttpException({ type: 'not found' }, HttpStatus.NOT_FOUND);
      }
      const { name: nameId, description: descriptionId } = entity;
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

  async getPrototype(id: number) {
    const entity = await this.prototypeRepository.findOneBy({ id });
    if (!entity) {
      throw new HttpException({ prototype: 'not found' }, HttpStatus.NOT_FOUND);
    }
    const { name: nameId, description: descriptionId } = entity;

    const [name, description] = await Promise.all([
      this.dictionaryRepository.findOneBy({ id: nameId }),
      this.dictionaryRepository.findOneBy({
        id: descriptionId,
      }),
    ]);

    return {
      ...entity,
      name,
      description,
    };
  }

  async createProperty(props: CreationPropertyProps) {
    await this.findByIdOrFail(props.prototypeId);

    return this.propertyService.create(props);
  }

  getProperties(prototypeId: number) {
    return this.propertyService.findByPrototypeId(prototypeId);
  }

  async getValues(prototypeId: number) {
    const prototype = await this.prototypeRepository.findOneBy({
      id: prototypeId,
    });
    if (!prototype) {
      throw new HttpException({ prototype: 'not found' }, HttpStatus.NOT_FOUND);
    }
    const properties = await this.typeService.findProperties(prototype.typeId);

    return Promise.all(
      properties.map(async (el) => {
        const [value, name, suffix] = await Promise.all([
          this.characteristicValueService.findByPrototypeAndCharacteristic({
            characteristicId: el.id,
            prototypeId,
          }),
          this.dictionaryRepository.findOneBy({ id: el.name }),
          this.dictionaryRepository.findOneBy({ id: el.suffix }),
        ]);
        return {
          id: el.id,
          isFilter: el.isFilter,
          display: el.display,
          value: value.value,
          name,
          suffix,
        };
      }),
    );
  }
}

type CreationProps = {
  name: string;
  description?: string;
  brandId: number;
  typeId: number;
  image?: string;
};

type UpdateProps = {
  name?: Partial<Record<AcceptedLanguagesEnum, string>>;
  description?: Partial<Record<AcceptedLanguagesEnum, string>>;
  id: number;
};

type CreationPropertyProps = {
  prototypeId: number;
  name: string;
  suffix: string;
  isFilter?: boolean;
  display?: boolean;
};
