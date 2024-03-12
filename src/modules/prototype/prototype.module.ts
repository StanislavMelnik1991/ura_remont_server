import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ProductPrototype,
  PrototypeProperty,
  TypePropertyValue,
  TypeProperty,
  Dictionary,
  Brand,
  ProductType,
} from 'database';
import { PrototypeService } from './prototype.service';
import { PrototypeController } from './prototype.controller';

@Module({
  controllers: [PrototypeController],
  providers: [PrototypeService],
  imports: [
    TypeOrmModule.forFeature([
      ProductPrototype,
      PrototypeProperty,
      TypePropertyValue,
      TypeProperty,
      Dictionary,
      Brand,
      ProductType,
    ]),
  ],
  exports: [],
})
export class PrototypeModule {}
