import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Dictionary } from 'database';
import { DictionaryService, TypeService } from 'services';
import { AcceptedLanguagesEnum } from 'shared/constants';

@Injectable()
export class AdminTypeService {
  constructor(
    private typeService: TypeService,
    private dictionaryService: DictionaryService,
  ) {}

  async create({ description, name }: CreationProps) {
    const { id: nameId } = await this.dictionaryService.create({ ru: name });
    const { id: descriptionId } = await this.dictionaryService.create({
      ru: description,
    });
    const { id } = await this.typeService.createType({
      name: nameId,
      description: descriptionId,
    });
    return { id };
  }

  async update({ description, name, id }: UpdateProps) {
    const type = await this.typeService.findById(id);
    if (!type) {
      throw new HttpException({ type: 'not found' }, HttpStatus.NOT_FOUND);
    }
    const { name: nameId, description: descriptionId } = type;
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

  async getType(id: number) {
    const type = await this.typeService.findById(id);
    if (!type) {
      throw new HttpException({ type: 'not found' }, HttpStatus.NOT_FOUND);
    }
    const { name: nameId, description: descriptionId, image } = type;
    const name = await this.dictionaryService.findById(nameId);
    const description = await this.dictionaryService.findById(descriptionId);

    return {
      id,
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
