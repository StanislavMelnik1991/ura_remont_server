import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacteristicValueController } from './characteristicValue.controller';
import { CharacteristicValueService } from './characteristicValue.service';
import { CharacteristicValue } from 'database';

@Module({
  controllers: [CharacteristicValueController],
  providers: [CharacteristicValueService],
  imports: [TypeOrmModule.forFeature([CharacteristicValue])],
  exports: [CharacteristicValueService],
})
export class CharacteristicValueModule {}
