import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity, ImageList } from 'database';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { AuthModule } from 'modules/auth';

@Module({
  controllers: [ImageController],
  providers: [ImageService],
  imports: [TypeOrmModule.forFeature([ImageEntity, ImageList]), AuthModule],
  exports: [ImageService],
})
export class ImageModule {}
