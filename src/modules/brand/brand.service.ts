import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from 'database';
import { type DeepPartial, Repository } from 'typeorm';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}
  async createBrand(props: DeepPartial<Brand>) {
    const data = this.brandRepository.create(props);
    return this.brandRepository.save(data);
  }
  findById(id: number) {
    return this.brandRepository.findOneBy({ id });
  }
  findByName(name: number) {
    return this.brandRepository.findOneBy({ name });
  }
}
