import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Dictionary } from 'database';
import { DictionaryService, BrandService } from 'services';
import { AcceptedLanguagesEnum } from 'shared/constants';

@Injectable()
export class AdminBrandService {
  constructor(
    private brandService: BrandService,
    private dictionaryService: DictionaryService,
  ) {}

  async create({ description, name }: CreationProps) {
    const { id: nameId } = await this.dictionaryService.create({ ru: name });
    const { id: descriptionId } = await this.dictionaryService.create({
      ru: description,
    });
    const { id } = await this.brandService.createBrand({
      name: nameId,
      description: descriptionId,
    });
    return { id };
  }

  async update({ description, name, id }: UpdateProps) {
    const brand = await this.brandService.findById(id);
    if (!brand) {
      throw new HttpException({ brand: 'not found' }, HttpStatus.NOT_FOUND);
    }
    const { name: nameId, description: descriptionId } = brand;
    const jobs: Array<Promise<Dictionary | void>> = [];
    if (name && nameId) {
      jobs.push(
        this.dictionaryService.updateTranslations({ id: nameId, ...name }),
      );
    }
    if (description && descriptionId) {
      jobs.push(
        this.dictionaryService.updateTranslations({
          id: descriptionId,
          ...description,
        }),
      );
    }
    await Promise.all(jobs);

    return { id };
  }
  async getBrand(id: number) {
    console.log(typeof id);
    const parsedId = Number(id);
    if (Number.isNaN(parsedId)) {
      throw new HttpException({ id: 'incorrect type' }, HttpStatus.BAD_REQUEST);
    }
    const brand = await this.brandService.findById(parsedId);
    if (!brand) {
      throw new HttpException({ brand: 'not found' }, HttpStatus.NOT_FOUND);
    }
    const { name: nameId, description: descriptionId, image } = brand;
    const name = await this.dictionaryService.findById(nameId);
    const description = await this.dictionaryService.findById(descriptionId);

    return {
      id: parsedId,
      name,
      description,
      image,
    };
  }
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
