import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dictionary } from 'database';
import { CreateDictionaryDto } from 'shared/schemas';
import { AcceptedLanguages } from 'shared/constants';
import { Repository } from 'typeorm';

@Injectable()
export class DictionaryService {
  constructor(
    @InjectRepository(Dictionary)
    private dictionaryRepository: Repository<Dictionary>,
  ) {}
  async create(props: CreateDictionaryDto) {
    const data = this.dictionaryRepository.create(props);
    return this.dictionaryRepository.save(data);
  }
  async findByLocale(locale: AcceptedLanguages, text: string) {
    return await this.dictionaryRepository.findOneBy({
      [locale]: text,
    });
  }
  async findByTextOrCreate(text: string) {
    let dict = await this.dictionaryRepository.findOneBy({
      ru: text,
    });
    if (!dict) {
      dict = this.dictionaryRepository.create({ ru: text });
    }
    return this.dictionaryRepository.save(dict);
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
