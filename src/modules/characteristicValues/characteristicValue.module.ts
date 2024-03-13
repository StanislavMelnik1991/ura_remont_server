import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacteristicValue } from 'database';
import { CharacteristicValueController } from './characteristicValue.controller';
import { CharacteristicValueService } from './characteristicValue.service';
import { CharacteristicModule } from 'modules/characteristic/characteristic.module';

@Module({
  controllers: [CharacteristicValueController],
  providers: [CharacteristicValueService],
  imports: [
    TypeOrmModule.forFeature([CharacteristicValue]),
    CharacteristicModule,
  ],
  exports: [CharacteristicValueService],
})
export class CharacteristicValueModule {}
