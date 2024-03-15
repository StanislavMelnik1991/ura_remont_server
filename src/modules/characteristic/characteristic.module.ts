import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacteristicController } from './characteristic.controller';
import { CharacteristicService } from './characteristic.service';
import { CharacteristicValueModule } from 'modules/characteristicValues/characteristicValue.module';
import { DictionaryModule } from 'modules/dictionary/dictionary.module';
import { Characteristic } from 'database';
import { AuthModule } from 'modules/auth';

@Module({
  controllers: [CharacteristicController],
  providers: [CharacteristicService],
  imports: [
    TypeOrmModule.forFeature([Characteristic]),
    CharacteristicValueModule,
    DictionaryModule,
    AuthModule,
  ],
  exports: [CharacteristicService],
})
export class CharacteristicModule {}
