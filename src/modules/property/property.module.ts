import { Module } from '@nestjs/common';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyValueModule } from 'modules/propertyValue/propertyValue.module';
import { PrototypeProperty } from 'database';
import { DictionaryModule } from 'modules/dictionary/dictionary.module';
import { AuthModule } from 'modules/auth';

@Module({
  controllers: [PropertyController],
  providers: [PropertyService],
  imports: [
    TypeOrmModule.forFeature([PrototypeProperty]),
    PropertyValueModule,
    DictionaryModule,
    AuthModule,
  ],
  exports: [PropertyService],
})
export class PropertyModule {}
