import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dictionary } from 'database';
import { DictionaryService } from './dictionary.service';

@Module({
  controllers: [],
  providers: [DictionaryService],
  imports: [TypeOrmModule.forFeature([Dictionary])],
  exports: [DictionaryService],
})
export class DictionaryModule {}