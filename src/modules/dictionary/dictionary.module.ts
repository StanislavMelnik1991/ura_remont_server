import { Module } from '@nestjs/common';
import { DictionaryController } from './dictionary.controller';
import { DictionaryService } from './dictionary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dictionary } from 'database';

@Module({
  controllers: [DictionaryController],
  providers: [DictionaryService],
  imports: [TypeOrmModule.forFeature([Dictionary])],
  exports: [DictionaryService],
})
export class DictionaryModule {}
