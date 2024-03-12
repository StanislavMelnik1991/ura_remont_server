import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductType, TypeProperty, TypePropertyValue } from 'database';
import { type DeepPartial, Repository } from 'typeorm';

@Injectable()
export class TypeService {
  constructor(
    @InjectRepository(ProductType)
    private typeRepository: Repository<ProductType>,
    @InjectRepository(TypeProperty)
    private propertyRepository: Repository<TypeProperty>,
    @InjectRepository(TypePropertyValue)
    private valueRepository: Repository<TypePropertyValue>,
  ) {}
  async createType(props: DeepPartial<ProductType>) {
    const data = this.typeRepository.create(props);
    return this.typeRepository.save(data);
  }

  findByName(name: number) {
    return this.typeRepository.findOneBy({ name });
  }

  findById(id: number) {
    return this.typeRepository.findOneBy({ id });
  }

  getAllTypes() {
    return this.typeRepository.findAndCount();
  }

  async createProperty(props: DeepPartial<TypeProperty>) {
    const data = this.propertyRepository.create(props);
    return this.propertyRepository.save(data);
  }

  async getTypeProperties(typeId: number) {
    return this.propertyRepository.findBy({ typeId });
  }

  async createValue(props: DeepPartial<TypePropertyValue>) {
    const data = this.valueRepository.create(props);
    return this.valueRepository.save(data);
  }

  async getPrototypeValues(prototypeId: number) {
    const values = await this.valueRepository.findBy({ prototypeId });
    return Promise.all(
      values.map(async ({ value, propertyId }) => {
        const { name, suffix } = await this.propertyRepository.findOneBy({
          id: propertyId,
        });
        return {
          name,
          value,
          suffix,
        };
      }),
    );
  }
  update({ id, name, description }: DeepPartial<ProductType>) {
    const old = this.typeRepository.findOneBy({ id });
    return this.typeRepository.save({ ...old, name, description });
  }
}
