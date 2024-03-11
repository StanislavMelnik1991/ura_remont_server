import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from 'database';
import { BrandService } from './brand.service';

@Module({
  controllers: [],
  providers: [BrandService],
  imports: [TypeOrmModule.forFeature([Brand])],
  exports: [BrandService],
})
export class BrandModule {}
