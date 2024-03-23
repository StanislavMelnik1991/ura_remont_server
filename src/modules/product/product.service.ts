import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'database';
import { PropertyValueService } from 'modules/propertyValue/propertyValue.service';
import { IUser } from 'shared/types';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    private valueService: PropertyValueService,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create({ user, price, ...props }: CreationProps) {
    const entity = this.productRepository.create({
      ...props,
      price: 100 * price,
    });
    await this.productRepository.save(entity);
    Logger.log(
      `user id: ${user.id} upload new Product id: ${entity.id}`,
      'Product',
    );
    return { id: entity.id };
  }

  async update({ user, id, ...props }: UpdateProps) {
    try {
      await this.productRepository.findOneByOrFail({ id });
    } catch (error) {
      Logger.warn('product not found', 'Product');
      throw new NotFoundException({ product: 'not found' });
    }
    await this.productRepository.update({ id }, { ...props });
    Logger.log(`user id: ${user.id} upload new Product id: ${id}`, 'Product');
    return { id };
  }

  findByIdOrFail(id: number) {
    try {
      return this.productRepository.findOneByOrFail({ id });
    } catch (error) {
      Logger.warn('product not found', 'Product');
      throw new NotFoundException({ product: 'not found' });
    }
  }

  createValue(props: CreateValueProps) {
    return this.valueService.create(props);
  }
}

type CreationProps = {
  prototypeId: number;
  externalId: string;
  externalName?: string;
  availableQuantity: number;
  price: number;
  user: IUser;
};

type UpdateProps = Partial<Omit<CreationProps, 'prototypeId'>> & {
  id: number;
  user: IUser;
};

type CreateValueProps = {
  productId: number;
  propertyId: number;
  value: string;
  user: IUser;
};
