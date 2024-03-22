import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand, Dictionary, ImageList } from 'database';
import { DictionaryService } from 'modules/dictionary/dictionary.service';
import { ImageService } from 'modules/image/image.service';
import { AcceptedLanguagesEnum } from 'shared/constants';
import { Repository, DataSource, UpdateResult } from 'typeorm';
import { CreateBrandSchemeType, GetBrandsSchemeType } from 'types/swagger';

@Injectable()
export class BrandService {
  constructor(
    private dataSource: DataSource,
    private dictionaryService: DictionaryService,
    private imageService: ImageService,

    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}
  async create({ description, name }: CreateBrandSchemeType) {
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
      const [savedName, savedDescription, images] = await Promise.all([
        queryRunner.manager.save(Dictionary, newName),
        queryRunner.manager.save(Dictionary, newDescription),
        queryRunner.manager.save(ImageList, newImages),
      ]);
      const newBrand = queryRunner.manager.create(Brand, {
        name: savedName.id,
        description: savedDescription.id,
        listId: images.id,
      });
      await queryRunner.manager.save(Brand, newBrand);

      await queryRunner.commitTransaction();
      return newBrand;
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

      return brand;
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
  async getBrand(id: number) {
    const entity = await this.brandRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException();
    }
    const [name, description] = await Promise.all([
      this.dictionaryService.findById(entity.name),
      this.dictionaryService.findById(entity.description),
    ]);
    if (!name || !description) {
      throw new InternalServerErrorException();
    }
    return { ...entity, name, description };
  }

  async findByIdOrFail(id: number) {
    try {
      return await this.brandRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new HttpException({ brand: 'not found' }, HttpStatus.NOT_FOUND);
    }
  }

  async getAllBrands({ page, perPage, searchValue }: GetBrandsSchemeType) {
    const [data, total] = await this.brandRepository
      .createQueryBuilder('brand')
      .leftJoinAndSelect('brand.name', 'name')
      .leftJoinAndSelect('brand.description', 'description')
      .leftJoinAndSelect('brand.images', 'listId')
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
    const type = await this.brandRepository.findOneBy({ id });
    if (!type) {
      throw new NotFoundException(`brand with id: ${id}`);
    }
    const basePath = `brand/${id}`;
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

type UpdateProps = {
  name?: Partial<Record<AcceptedLanguagesEnum, string>>;
  description?: Partial<Record<AcceptedLanguagesEnum, string>>;
  id: number;
};
