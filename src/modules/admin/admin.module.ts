import { Module } from '@nestjs/common';
import { BrandModule, DictionaryModule, TypeModule } from '../shared';
import { AdminBrandService, AdminTypeService } from 'services/admin';
import { AdminBrandController, AdminTypeController } from 'controllers';

@Module({
  controllers: [AdminBrandController, AdminTypeController],
  providers: [AdminBrandService, AdminTypeService],
  imports: [DictionaryModule, TypeModule, BrandModule],
  exports: [],
})
export class AdminModule {}
