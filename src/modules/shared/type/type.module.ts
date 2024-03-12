import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductType, TypeProperty, TypePropertyValue } from 'database';
import { TypeService } from 'services';

@Module({
  controllers: [],
  providers: [TypeService],
  imports: [
    TypeOrmModule.forFeature([ProductType, TypeProperty, TypePropertyValue]),
  ],
  exports: [TypeService],
})
export class TypeModule {}
