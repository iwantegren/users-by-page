import { Module } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { PhotoController } from './photo.controller';
import { TinifyService } from './tinify.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPhotoEntity } from './dto/user-photo.dto';

@Module({
  imports: [TypeOrmModule.forFeature([UserPhotoEntity])],
  providers: [PhotoService, TinifyService],
  exports: [PhotoService],
  controllers: [PhotoController],
})
export class PhotoModule {}
