import { Module } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { PhotoController } from './photo.controller';
import { TinifyService } from './tinify.service';

@Module({
  providers: [PhotoService, TinifyService],
  exports: [PhotoService],
  controllers: [PhotoController],
})
export class PhotoModule {}
