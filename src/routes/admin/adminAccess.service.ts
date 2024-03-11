import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DictionaryService } from 'modules/dictionary';
import { TypeService } from 'modules/type';

@Injectable()
export class AdminsAccessService {
  constructor(
    private typeService: TypeService,
    private dictionaryService: DictionaryService,
  ) {}

  async createType({
    name,
    description,
  }: {
    name: string;
    description?: string;
  }) {
    const existed = await this.dictionaryService.findByLocale('ru', name);
    if (existed) {
      const conflict = await this.typeService.findByName(existed.id);
      if (conflict) {
        throw new HttpException('already exist', HttpStatus.CONFLICT);
      }
    }
    const localizedName = await this.dictionaryService.create({ ru: name });
    let descriptionId: number | null = null;

    if (description) {
      descriptionId = (
        await this.dictionaryService.findByTextOrCreate(description)
      ).id;
    }
    const type = await this.typeService.createType({
      name: localizedName.id,
      description: descriptionId,
    });

    return { id: type.id };
  }

  async createTypeProperties({
    name,
    suffix,
    id,
    display,
    isFilter,
  }: {
    name: string;
    suffix?: string;
    id: string;
    display?: boolean;
    isFilter?: boolean;
  }) {
    const typeId = Number(id);

    if (Number.isNaN(typeId)) {
      throw new HttpException('invalid Id', HttpStatus.BAD_REQUEST);
    }

    const type = await this.typeService.findById(typeId);
    if (!type) {
      throw new HttpException(
        `type with id = ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const localizedName = await this.dictionaryService.findByTextOrCreate(name);
    let suffixId: number | null = null;
    if (suffix) {
      suffixId = (await this.dictionaryService.findByTextOrCreate(suffix)).id;
    }
    const property = await this.typeService.createProperty({
      typeId,
      name: localizedName.id,
      suffix: suffixId,
      display,
      isFilter,
    });
    return { id: property.id };
  }
}
