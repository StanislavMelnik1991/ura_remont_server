import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dictionary } from 'database';
import { AcceptedLanguages } from 'shared/constants';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class DictionaryService {
  constructor(
    @InjectRepository(Dictionary)
    private dictionaryRepository: Repository<Dictionary>,
  ) {}
  async create(props: DeepPartial<Dictionary>) {
    const data = this.dictionaryRepository.create(props);
    return this.dictionaryRepository.save(data);
  }
  findByLocaleText(locale: AcceptedLanguages, text: string) {
    return this.dictionaryRepository.findOneBy({
      [locale]: text,
    });
  }
  findById(id: number) {
    return this.dictionaryRepository.findOneBy({ id });
  }
  async updateTranslations({
    id,
    ...locales
  }: Partial<Record<AcceptedLanguages, string>> & { id: number }) {
    const dict = await this.dictionaryRepository.findOneBy({ id });
    if (!dict) {
      throw new HttpException(
        `not found dictionary with id = ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    const newDict = { ...dict, ...locales };
    return this.dictionaryRepository.save(newDict);
  }
}
