import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { DictionaryModule } from 'modules/dictionary/dictionary.module';
import { Brand } from 'database';

@Module({
  controllers: [BrandController],
  providers: [BrandService],
  imports: [TypeOrmModule.forFeature([Brand]), DictionaryModule],
  exports: [BrandService],
})
export class BrandModule {}
