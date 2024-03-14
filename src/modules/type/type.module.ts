import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeController } from './type.controller';
import { TypeService } from './type.service';
import { CharacteristicModule } from 'modules/characteristic/characteristic.module';
import { DictionaryModule } from 'modules/dictionary/dictionary.module';
import { ProductType } from 'database';
import { AuthModule } from 'modules/auth';

@Module({
  controllers: [TypeController],
  providers: [TypeService],
  imports: [
    TypeOrmModule.forFeature([ProductType]),
    DictionaryModule,
    CharacteristicModule,
    AuthModule,
  ],
  exports: [TypeService],
})
export class TypeModule {}
