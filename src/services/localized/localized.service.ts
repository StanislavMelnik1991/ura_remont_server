import { Injectable } from '@nestjs/common';
import { DictionaryService } from 'services';

@Injectable()
export class LocalizedService {
  constructor(private dictionaryService: DictionaryService) {}
}
