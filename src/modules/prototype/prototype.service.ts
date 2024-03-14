import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CharacteristicValueService } from 'modules/characteristicValues/characteristicValue.service';
import { PropertyService } from 'modules/property/property.service';
import { AcceptedLanguagesEnum } from 'shared/constants';
import { Repository, DataSource, UpdateResult } from 'typeorm';
import { DictionaryService } from 'modules/dictionary/dictionary.service';
import { ProductService } from 'modules/product/product.service';
import { Dictionary, ProductPrototype } from 'database';
import { BrandService } from 'modules/brand';
import { TypeService } from 'modules/type';

@Injectable()
export class PrototypeService {
  constructor(
    private dataSource: DataSource,

    private propertyService: PropertyService,
    private dictionaryService: DictionaryService,
    private valueService: CharacteristicValueService,
    private productService: ProductService,
    private brandService: BrandService,
    private typeService: TypeService,

    @InjectRepository(ProductPrototype)
    private prototypeRepository: Repository<ProductPrototype>,
  ) {}
  findByIdOrFail(id: number) {
    try {
      return this.prototypeRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new HttpException({ prototype: 'not found' }, HttpStatus.NOT_FOUND);
    }
  }
  async create({ description, name, brandId, typeId, image }: CreationProps) {
    await Promise.all([
      this.typeService.findByIdOrFail(typeId),
      this.brandService.findByIdOrFail(brandId),
    ]);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
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
      throw new HttpException(err.detail, HttpStatus.INTERNAL_SERVER_ERROR);
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
      this.dictionaryService.findById(nameId),
      this.dictionaryService.findById(descriptionId),
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
          this.valueService.findByPrototypeAndCharacteristic({
            characteristicId: el.id,
            prototypeId,
          }),
          this.dictionaryService.findById(el.name),
          this.dictionaryService.findById(el.suffix),
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
