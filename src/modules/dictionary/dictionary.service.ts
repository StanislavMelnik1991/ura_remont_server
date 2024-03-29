import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dictionary } from 'database';
import { IUser } from 'shared/types';
import { Repository } from 'typeorm';

@Injectable()
export class DictionaryService {
  constructor(
    @InjectRepository(Dictionary)
    private dictionaryRepository: Repository<Dictionary>,
  ) {}

  async create(props: CreationProps) {
    const entity = this.dictionaryRepository.create(props);
    await this.dictionaryRepository.save(entity);
    return { id: entity.id };
  }

  findById(id: number) {
    return this.dictionaryRepository.findOneBy({ id });
  }

  async update({ user, id, ...props }: UpdatingProps) {
    await this.dictionaryRepository.update({ id }, props);
    Logger.log(
      `user with id: ${user.id} create new dictionary with id: ${id}`,
      'Dictionary',
    );
    return { id };
  }
}

type CreationProps = {
  ru: string;
  be?: string;
  uk?: string;
  en?: string;
  pl?: string;
};

type UpdatingProps = Partial<CreationProps> & { id: number; user: IUser };
