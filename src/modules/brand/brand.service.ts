import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand, Dictionary, ImageList } from 'database';
import { ImageService } from 'modules/image/image.service';
import { AcceptedLanguagesEnum } from 'shared/constants';
import { IUser } from 'shared/types';
import { Repository, DataSource, UpdateResult } from 'typeorm';
import { CreateBrandSchemeType, GetBrandsSchemeType } from 'types/swagger';

@Injectable()
export class BrandService {
  constructor(
    private dataSource: DataSource,
    private imageService: ImageService,

    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}
  async create({
    description,
    name,
    user,
  }: CreateBrandSchemeType & { user: IUser }) {
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
        nameId: savedName.id,
        descriptionId: savedDescription.id,
        listId: images.id,
      });
      await queryRunner.manager.save(Brand, newBrand);

      await queryRunner.commitTransaction();
      Logger.log(
        `user with id: ${user.id} create new brand id: ${newBrand.id}`,
        'Brand',
      );
      return newBrand;
    } catch (err) {
      Logger.error('InternalServerErrorException', 'Brand');
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  async update({ description, name, id, user }: UpdateProps & { user: IUser }) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const brand = await queryRunner.manager.findOneBy(Brand, { id });
      if (!brand) {
        Logger.warn('brand not found', 'Brand');
        throw new NotFoundException({ brand: 'not found' });
      }
      const { nameId, descriptionId } = brand;
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
        `user with id: ${user.id} update brand with id: ${brand.id}`,
        'Brand',
      );
      return brand;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (err instanceof HttpException) {
        throw new HttpException(err.getResponse(), err.getStatus());
      }
      Logger.error('InternalServerErrorException', 'Brand');
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }
  async getBrand(id: number) {
    try {
      const entity = await this.brandRepository
        .createQueryBuilder('brand')
        .leftJoinAndSelect('brand.name', 'name')
        .leftJoinAndSelect('brand.description', 'description')
        .leftJoinAndSelect('brand.images', 'images')
        .leftJoinAndSelect('images.images', 'image')
        .where({ id })
        .getOneOrFail();
      return entity;
    } catch (error) {
      Logger.warn('brand not found', 'Brand');
      throw new NotFoundException({ brand: 'not found' });
    }
  }

  async findByIdOrFail(id: number) {
    try {
      return await this.brandRepository.findOneByOrFail({ id });
    } catch (error) {
      Logger.warn('brand not found', 'Brand');
      throw new NotFoundException({ brand: 'not found' });
    }
  }

  async getAllBrands({ page, perPage, searchValue }: GetBrandsSchemeType) {
    const [data, total] = await this.brandRepository
      .createQueryBuilder('brand')
      .leftJoinAndSelect('brand.name', 'name')
      .leftJoinAndSelect('brand.description', 'description')
      .leftJoinAndSelect('brand.images', 'images')
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
  async uploadImage({ data, id, user }: UploadImageProps & { user: IUser }) {
    const brand = await this.brandRepository.findOneBy({ id });
    if (!brand) {
      Logger.warn('Brand not found', 'Brand');
      throw new NotFoundException(`brand with id: ${id}`);
    }
    const basePath = `brand/${id}`;
    return this.imageService.addImageToList({
      basePath,
      data,
      listId: brand.listId,
      userId: user.id,
    });
  }

  async deleteBrand({ userId, id }: DeleteBrandProps) {
    const brand = await this.brandRepository.findOneBy({ id });
    if (!brand) {
      Logger.warn(`brand ${id} not found`, 'Brand');
      throw new NotFoundException({ brand: 'not found' });
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { nameId, descriptionId, listId } = brand;

      await Promise.all([
        queryRunner.manager.delete(Brand, { id }),
        queryRunner.manager.delete(Dictionary, { id: nameId }),
        queryRunner.manager.delete(Dictionary, { id: descriptionId }),
        queryRunner.manager.delete(ImageList, { id: listId }),
      ]);

      await queryRunner.commitTransaction();
      Logger.log(
        `user with id: ${userId} delete brand with id: ${brand.id}`,
        'Brand',
      );
      return brand;
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      if (err instanceof HttpException) {
        throw new HttpException(err.getResponse(), err.getStatus());
      }
      Logger.error(`Internal error Delete brand ${id}`, 'Brand');
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }
}

interface DeleteBrandProps {
  id: number;
  userId: number;
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
