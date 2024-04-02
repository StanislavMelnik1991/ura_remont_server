import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CharacteristicValueService } from 'modules/characteristicValues/characteristicValue.service';
import { PropertyService } from 'modules/property/property.service';
import { AcceptedLanguagesEnum } from 'shared/constants';
import { Repository, DataSource, UpdateResult } from 'typeorm';
import { DictionaryService } from 'modules/dictionary/dictionary.service';
import { Dictionary, ImageList, ProductPrototype } from 'database';
import { BrandService } from 'modules/brand';
import { TypeService } from 'modules/type';
import { ImageService } from 'modules/image/image.service';
import { IUser } from 'shared/types';

@Injectable()
export class PrototypeService {
  constructor(
    private dataSource: DataSource,

    private propertyService: PropertyService,
    private dictionaryService: DictionaryService,
    private valueService: CharacteristicValueService,
    private brandService: BrandService,
    private typeService: TypeService,
    private imageService: ImageService,

    @InjectRepository(ProductPrototype)
    private prototypeRepository: Repository<ProductPrototype>,
  ) {}
  findByIdOrFail(id: number) {
    try {
      return this.prototypeRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException({ prototype: 'not found' });
    }
  }
  async create({
    description,
    name,
    brandId,
    typeId,
    image,
    user,
  }: CreationProps) {
    await Promise.all([
      this.typeService.findByIdOrFail(typeId),
      this.brandService.findByIdOrFail(brandId),
    ]);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newImages = queryRunner.manager.create(ImageList);
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
      const [savedName, savedDescription, imageList] = await Promise.all([
        queryRunner.manager.save(Dictionary, newName),
        queryRunner.manager.save(Dictionary, newDescription),
        queryRunner.manager.save(ImageList, newImages),
      ]);
      const entity = queryRunner.manager.create(ProductPrototype, {
        nameId: savedName.id,
        descriptionId: savedDescription.id,
        image,
        brandId,
        typeId,
        listId: imageList.id,
      });
      await queryRunner.manager.save(ProductPrototype, entity);

      await queryRunner.commitTransaction();

      Logger.log(
        `user id: ${user.id} upload new ProductPrototype id: ${entity.id}`,
        'ProductPrototype',
      );
      return { id: entity.id };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (err instanceof HttpException) {
        throw new HttpException(err.getResponse(), err.getStatus());
      }
      Logger.error(`InternalServerErrorException`, 'Prototype');
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  async update({ description, name, id, user }: UpdateProps) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entity = await queryRunner.manager.findOneBy(ProductPrototype, {
        id,
      });
      if (!entity) {
        Logger.warn(`Prototype not found`, 'Prototype');
        throw new NotFoundException({ type: 'not found' });
      }
      const { nameId, descriptionId } = entity;
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
      Logger.log(
        `user id: ${user.id} upload new ProductPrototype id: ${entity.id}`,
        'ProductPrototype',
      );
      return { id };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (err instanceof HttpException) {
        throw new HttpException(err.getResponse(), err.getStatus());
      }
      Logger.error(`InternalServerErrorException`, 'Prototype');
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  async getPrototype(id: number) {
    return this.prototypeRepository.findOneBy({ id });
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
      Logger.warn(`Prototype not found`, 'Prototype');
      throw new NotFoundException({ prototype: 'not found' });
    }
    const properties = await this.typeService.findProperties(prototype.typeId);

    return Promise.all(
      properties.map(async (el) => {
        const [value, name, suffix] = await Promise.all([
          this.valueService.findByPrototypeAndCharacteristic({
            characteristicId: el.id,
            prototypeId,
          }),
          this.dictionaryService.findById(el.nameId),
          this.dictionaryService.findById(el.suffixId),
        ]);
        return {
          id: el.id,
          isFilter: el.isFilter,
          display: el.display,
          value: value?.value || null,
          name,
          suffix,
        };
      }),
    );
  }

  async uploadImage({ data, id, user }: UploadImageProps) {
    const type = await this.prototypeRepository.findOneBy({ id });
    if (!type) {
      Logger.error(`InternalServerErrorException`, 'Prototype');
      throw new NotFoundException({ prototype: id });
    }
    const basePath = `prototype/${id}`;
    return this.imageService.addImageToList({
      basePath,
      data,
      listId: type.listId,
      userId: user.id,
    });
  }

  async deletePrototype({ userId, id }: DeleteProps) {
    const prototype = await this.prototypeRepository.findOneBy({ id });
    if (!prototype) {
      Logger.warn(`Prototype ${id} not found`, 'Prototype');
      throw new NotFoundException({ prototype: 'not found' });
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { nameId, descriptionId, listId } = prototype;

      await Promise.all([
        queryRunner.manager.delete(ProductPrototype, { id }),
        queryRunner.manager.delete(Dictionary, { id: nameId }),
        queryRunner.manager.delete(Dictionary, { id: descriptionId }),
        queryRunner.manager.delete(ImageList, { id: listId }),
      ]);

      await queryRunner.commitTransaction();
      Logger.log(
        `user with id: ${userId} delete prototype with id: ${prototype.id}`,
        'Prototype',
      );
      return prototype;
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      if (err instanceof HttpException) {
        throw new HttpException(err.getResponse(), err.getStatus());
      }
      Logger.error(`Internal error Delete prototype ${id}`, 'Prototype');
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }
}

interface DeleteProps {
  id: number;
  userId: number;
}

interface UploadImageProps {
  id: number;
  data: Buffer;
  user: IUser;
}

type CreationProps = {
  name: string;
  description?: string;
  brandId: number;
  typeId: number;
  image?: string;
  user: IUser;
};

type UpdateProps = {
  name?: Partial<Record<AcceptedLanguagesEnum, string>>;
  description?: Partial<Record<AcceptedLanguagesEnum, string>>;
  id: number;
  user: IUser;
};

type CreationPropertyProps = {
  prototypeId: number;
  name: string;
  suffix: string;
  isFilter?: boolean;
  display?: boolean;
  user: IUser;
};
