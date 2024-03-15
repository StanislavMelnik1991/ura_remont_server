import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyValueModule } from 'modules/propertyValue/propertyValue.module';
import { Product } from 'database';
import { AuthModule } from 'modules/auth';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [
    TypeOrmModule.forFeature([Product]),
    PropertyValueModule,
    AuthModule,
  ],
  exports: [ProductService],
})
export class ProductModule {}
