import { Module } from '@nestjs/common';
import { LocalizedController } from 'controllers/localized';
import { BrandModule, DictionaryModule, TypeModule } from '../shared';
import { LocalizedService } from 'services';

@Module({
  controllers: [LocalizedController],
  providers: [LocalizedService],
  imports: [DictionaryModule, TypeModule, BrandModule],
  exports: [],
})
export class LocalizedModule {}
