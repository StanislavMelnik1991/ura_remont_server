import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandController } from './brand.controller';
import { Brand, Dictionary } from 'database';
import { BrandService } from './brand.service';

@Module({
  controllers: [BrandController],
  providers: [BrandService],
  imports: [TypeOrmModule.forFeature([Brand, Dictionary])],
  exports: [BrandService],
})
export class BrandModule {}
