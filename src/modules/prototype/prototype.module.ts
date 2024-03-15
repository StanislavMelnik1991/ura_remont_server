import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrototypeService } from './prototype.service';
import { PrototypeController } from './prototype.controller';
import { CharacteristicValueModule } from 'modules/characteristicValues/characteristicValue.module';
import { PropertyModule } from 'modules/property/property.module';
import { ProductModule } from 'modules/product/product.module';
import { DictionaryModule } from 'modules/dictionary/dictionary.module';
import { ProductPrototype } from 'database';
import { TypeModule } from 'modules/type';
import { BrandModule } from 'modules/brand';
import { AuthModule } from 'modules/auth';

@Module({
  controllers: [PrototypeController],
  providers: [PrototypeService],
  imports: [
    TypeOrmModule.forFeature([ProductPrototype]),
    CharacteristicValueModule,
    PropertyModule,
    ProductModule,
    DictionaryModule,
    BrandModule,
    TypeModule,
    AuthModule,
  ],
  exports: [PrototypeService],
})
export class PrototypeModule {}
