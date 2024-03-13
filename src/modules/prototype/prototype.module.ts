import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductPrototype, Dictionary } from 'database';
import { PrototypeService } from './prototype.service';
import { PrototypeController } from './prototype.controller';
import { PropertyModule } from 'modules/property/property.module';
import { CharacteristicValueModule } from 'modules/characteristicValues/characteristicValue.module';
import { TypeModule } from 'modules/type/type.module';
import { BrandModule } from 'modules/brand/brand.module';

@Module({
  controllers: [PrototypeController],
  providers: [PrototypeService],
  imports: [
    TypeOrmModule.forFeature([ProductPrototype, Dictionary]),
    PropertyModule,
    CharacteristicValueModule,
    TypeModule,
    BrandModule,
  ],
  exports: [PrototypeService],
})
export class PrototypeModule {}
