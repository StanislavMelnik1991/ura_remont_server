import { Module } from '@nestjs/common';
import { PropertyValueController } from './propertyValue.controller';
import { PropertyValueService } from './propertyValue.service';
import { PropertyModule } from 'modules/property/property.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyValue } from 'database/entities/propertyValue.entity';

@Module({
  controllers: [PropertyValueController],
  providers: [PropertyValueService],
  imports: [PropertyModule, TypeOrmModule.forFeature([PropertyValue])],
  exports: [PropertyValueService],
})
export class PropertyValueModule {}
