import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'database';
import { PropertyValueService } from 'modules/propertyValue/propertyValue.service';
import { PrototypeService } from 'modules/prototype/prototype.service';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    private prototypeService: PrototypeService,
    private valueService: PropertyValueService,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(props: CreationProps) {
    await this.prototypeService.findByIdOrFail(props.prototypeId);
    const entity = this.productRepository.create({
      ...props,
      price: 100 * props.price,
    });
    await this.productRepository.save(entity);
    return { id: entity.id };
  }

  async update({ id, ...props }: UpdateProps) {
    try {
      await this.productRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new HttpException({ product: 'not found' }, HttpStatus.NOT_FOUND);
    }
    await this.productRepository.update({ id }, { ...props });
    return { id };
  }

  findByIdOrFail(id: number) {
    try {
      return this.productRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new HttpException({ product: 'not found' }, HttpStatus.NOT_FOUND);
    }
  }

  createValue(props: CreateValueProps) {
    return this.valueService.createValue(props);
  }
}

type CreationProps = {
  prototypeId: number;
  externalId: string;
  externalName?: string;
  availableQuantity: number;
  price: number;
};

type UpdateProps = Partial<Omit<CreationProps, 'prototypeId'>> & { id: number };

type CreateValueProps = {
  productId: number;
  propertyId: number;
  value: string;
};
