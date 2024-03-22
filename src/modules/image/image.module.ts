import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity, ImageList } from 'database';
import { ImageService } from './image.service';

@Module({
  controllers: [],
  providers: [ImageService],
  imports: [TypeOrmModule.forFeature([ImageEntity, ImageList])],
  exports: [ImageService],
})
export class ImageModule {}
