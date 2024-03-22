import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { DictionaryModule } from 'modules/dictionary/dictionary.module';
import { Brand } from 'database';
import { AuthModule } from 'modules/auth';
import { ImageModule } from 'modules/image/image.module';

@Module({
  controllers: [BrandController],
  providers: [BrandService],
  imports: [
    TypeOrmModule.forFeature([Brand]),
    DictionaryModule,
    AuthModule,
    ImageModule,
  ],
  exports: [BrandService],
})
export class BrandModule {}
