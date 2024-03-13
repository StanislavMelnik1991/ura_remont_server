import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeController } from './type.controller';
import { Dictionary, ProductType, Characteristic } from 'database';
import { TypeService } from './type.service';
import { CharacteristicModule } from 'modules/characteristic/characteristic.module';

@Module({
  controllers: [TypeController],
  providers: [TypeService],
  imports: [
    TypeOrmModule.forFeature([ProductType, Characteristic, Dictionary]),
    CharacteristicModule,
  ],
  exports: [TypeService],
})
export class TypeModule {}
