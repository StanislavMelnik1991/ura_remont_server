import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeController } from './type.controller';
import { Dictionary, ProductType, TypeProperty } from 'database';
import { TypeService } from './type.service';

@Module({
  controllers: [TypeController],
  providers: [TypeService],
  imports: [TypeOrmModule.forFeature([ProductType, TypeProperty, Dictionary])],
  exports: [TypeService],
})
export class TypeModule {}
