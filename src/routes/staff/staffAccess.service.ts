import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DictionaryService } from 'modules/dictionary';
import {
  CreateDictionaryDto,
  FindDictionaryByLocaleDto,
  UpdateDictionaryDto,
} from 'shared/schemas';

@Injectable()
export class StaffAccessService {
  constructor(private dictionaryService: DictionaryService) {}

  async createDictionary(data: CreateDictionaryDto) {
    const dict = await this.dictionaryService.create(data);
    return { id: dict.id };
  }

  async findByLocale({ locale, value }: FindDictionaryByLocaleDto) {
    const dict = await this.dictionaryService.findByLocale(locale, value);
    if (!dict) {
      throw new HttpException(
        `not found dictionary with { ${locale} = ${value} }`,
        HttpStatus.NOT_FOUND,
      );
    }
    return dict;
  }
  updateDictionary(data: UpdateDictionaryDto, id: string) {
    if (Number.isNaN(Number(id))) {
      throw new HttpException('invalid Id', HttpStatus.BAD_REQUEST);
    }
    return this.dictionaryService.updateTranslations({
      id: Number(id),
      ...data,
    });
  }
}
