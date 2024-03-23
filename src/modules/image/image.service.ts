import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntity, ImageList } from 'database';
import { storage } from 'firebase-admin';
import { getDownloadURL } from 'firebase-admin/storage';
import { PipelineSource } from 'stream';
import { Repository } from 'typeorm';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(ImageEntity)
    private imageRepository: Repository<ImageEntity>,
    @InjectRepository(ImageList)
    private listRepository: Repository<ImageList>,
  ) {}

  createList() {
    const entity = this.listRepository.create();
    return this.listRepository.save(entity);
  }

  async addImageToList({ basePath, data, listId, userId }: CreatingImageProps) {
    const bucket = storage().bucket();
    const filePath = `${basePath}/${Date.now()}`;
    const file = bucket.file(filePath);
    await file.save(data, { private: false }).catch((err) => {
      Logger.error(err.message, 'Image');
    });
    const url = await getDownloadURL(file);
    const entity = this.imageRepository.create({
      listId,
      image: url,
      filePath,
    });
    Logger.log(`user id: ${userId} upload new image id: ${entity.id}`, 'Brand');
    return this.imageRepository.save(entity);
  }
}

interface CreatingImageProps {
  listId: number;
  basePath: string;
  data: string | Buffer | PipelineSource<string | Buffer>;
  userId: number;
}
