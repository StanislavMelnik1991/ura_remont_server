import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeController } from 'controllers';
import {
  Dictionary,
  ProductType,
  TypeProperty,
  TypePropertyValue,
} from 'database';
import { TypeService } from 'services';

@Module({
  controllers: [TypeController],
  providers: [TypeService],
  imports: [
    TypeOrmModule.forFeature([
      ProductType,
      TypeProperty,
      TypePropertyValue,
      Dictionary,
    ]),
  ],
  exports: [TypeService],
})
export class TypeModule {}
