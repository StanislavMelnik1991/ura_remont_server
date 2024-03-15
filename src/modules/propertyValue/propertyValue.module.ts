import { Module } from '@nestjs/common';
import { PropertyValueController } from './propertyValue.controller';
import { PropertyValueService } from './propertyValue.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyValue } from 'database';
import { AuthModule } from 'modules/auth';

@Module({
  controllers: [PropertyValueController],
  providers: [PropertyValueService],
  imports: [TypeOrmModule.forFeature([PropertyValue]), AuthModule],
  exports: [PropertyValueService],
})
export class PropertyValueModule {}
