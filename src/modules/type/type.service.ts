import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dictionary, ImageList, ProductType } from 'database';
import { CharacteristicService } from 'modules/characteristic/characteristic.service';
import { DictionaryService } from 'modules/dictionary/dictionary.service';
import { ImageService } from 'modules/image/image.service';
import { AcceptedLanguagesEnum } from 'shared/constants';
import { Repository, DataSource, UpdateResult } from 'typeorm';
import { GetAllTypeSDto } from 'types/swagger';

@Injectable()
export class TypeService {
  constructor(
    private dataSource: DataSource,
    private characteristicService: CharacteristicService,
    private dictionaryService: DictionaryService,
    private imageService: ImageService,

    @InjectRepository(ProductType)
    private typeRepository: Repository<ProductType>,
  ) {}
  async create({ description, name }: CreationProps) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newImages = queryRunner.manager.create(ImageList);
      const newName = queryRunner.manager.create(Dictionary, {
        ru: name,
      });
      const newDescription = queryRunner.manager.create(Dictionary, {
        ru: description,
      });
      const [savedName, savedDescription, imageList] = await Promise.all([
        queryRunner.manager.save(Dictionary, newName),
        queryRunner.manager.save(Dictionary, newDescription),
        queryRunner.manager.save(ImageList, newImages),
      ]);
      const newType = queryRunner.manager.create(ProductType, {
        nameId: savedName.id,
        descriptionId: savedDescription.id,
        listId: imageList.id,
      });
      await queryRunner.manager.save(ProductType, newType);

      await queryRunner.commitTransaction();
      return newType;
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

  async getType(id: number) {
    try {
      const entity = await this.typeRepository
        .createQueryBuilder('type')
        .leftJoinAndSelect('type.name', 'name')
        .leftJoinAndSelect('type.description', 'description')
        .leftJoinAndSelect('type.images', 'images')
        .leftJoinAndSelect('images.images', 'image')
        .where({ id })
        .getOneOrFail();
      return entity;
    } catch (error) {
      throw new NotFoundException({ type: 'not found' });
    }
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

  async getAllTypes({ page, perPage, searchValue }: GetAllTypeSDto) {
    const [data, total] = await this.typeRepository
      .createQueryBuilder('type')
      .leftJoinAndSelect('type.name', 'name')
      .leftJoinAndSelect('type.description', 'description')
      .leftJoinAndSelect('type.images', 'images')
      .leftJoinAndSelect('images.images', 'image')
      .where(
        'LOWER(name.ru) LIKE :searchValue OR LOWER(description.ru) LIKE :searchValue',
        { searchValue: `%${searchValue}%` },
      )
      .take(perPage)
      .skip(perPage * (page - 1))
      .getManyAndCount();
    return { data, total };
  }

  async uploadImage({ data, id }: UploadImageProps) {
    const type = await this.typeRepository.findOneBy({ id });
    if (!type) {
      throw new NotFoundException(`type with id: ${id}`);
    }
    const basePath = `type/${id}`;
    return this.imageService.addImageToList({
      basePath,
      data,
      listId: type.listId,
    });
  }
}

interface UploadImageProps {
  id: number;
  data: Buffer;
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
