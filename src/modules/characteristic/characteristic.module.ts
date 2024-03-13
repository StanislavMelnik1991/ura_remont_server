import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Characteristic } from 'database';
import { CharacteristicController } from './characteristic.controller';
import { CharacteristicService } from './characteristic.service';

@Module({
  controllers: [CharacteristicController],
  providers: [CharacteristicService],
  imports: [TypeOrmModule.forFeature([Characteristic])],
  exports: [CharacteristicService],
})
export class CharacteristicModule {}
