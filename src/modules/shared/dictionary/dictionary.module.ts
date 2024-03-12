import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dictionary } from 'database';
import { DictionaryService } from 'services';

@Module({
  controllers: [],
  providers: [DictionaryService],
  imports: [TypeOrmModule.forFeature([Dictionary])],
  exports: [DictionaryService],
})
export class DictionaryModule {}
