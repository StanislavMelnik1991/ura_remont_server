import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PrototypeModule } from 'modules/prototype/prototype.module';
import { PropertyValueModule } from 'modules/propertyValue/propertyValue.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'database';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [
    PrototypeModule,
    PropertyValueModule,
    TypeOrmModule.forFeature([Product]),
  ],
  exports: [],
})
export class ProductModule {}
