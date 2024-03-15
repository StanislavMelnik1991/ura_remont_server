import { Module } from '@nestjs/common';
import { DictionaryController } from './dictionary.controller';
import { DictionaryService } from './dictionary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dictionary } from 'database';
import { AuthModule } from 'modules/auth';

@Module({
  controllers: [DictionaryController],
  providers: [DictionaryService],
  imports: [TypeOrmModule.forFeature([Dictionary]), AuthModule],
  exports: [DictionaryService],
})
export class DictionaryModule {}
