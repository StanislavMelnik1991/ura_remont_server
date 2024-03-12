import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Dictionary } from 'database';
import { DictionaryService, TypeService } from 'services';
import { AcceptedLanguagesEnum } from 'shared/constants';
import { DeepPartial } from 'typeorm';

@Injectable()
export class AdminTypeService {
  constructor(
    private typeService: TypeService,
    private dictionaryService: DictionaryService,
  ) {}

  async create({ description, name }: CreationProps) {
    const { id: nameId } = await this.dictionaryService.create({ ru: name });
    const { id: descriptionId } = description
      ? await this.dictionaryService.create({
          ru: description,
        })
      : { id: null };
    const { id } = await this.typeService.createType({
      name: nameId,
      description: descriptionId,
    });
    return { id };
  }

  async update({ description, name, id }: UpdateProps) {
    const parsedId = Number(id);
    if (Number.isNaN(parsedId)) {
      throw new HttpException({ id: 'incorrect type' }, HttpStatus.BAD_REQUEST);
    }
    const brand = await this.typeService.findById(parsedId);
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
    } else if (description) {
      jobs.push(this.createDescription(description, parsedId));
    }

    await Promise.all(jobs);
    /* await Promise.all([
      name &&
        this.dictionaryService.updateTranslations({ id: nameId, ...name }),
      description &&
        this.dictionaryService.updateTranslations({
          id: descriptionId,
          ...description,
        }),
    ]); */

    return { id: parsedId };
  }
  private async createDescription(dict: DeepPartial<Dictionary>, id: number) {
    const description = await this.dictionaryService.create(dict);
    await this.typeService.update({ id, description: description.id });
    return description;
  }
}

type CreationProps = {
  name: string;
  description?: string;
};
type UpdateProps = {
  name?: Partial<Record<AcceptedLanguagesEnum, string>>;
  description?: Partial<Record<AcceptedLanguagesEnum, string>>;
  id: string;
};
