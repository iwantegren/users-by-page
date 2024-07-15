import { Module } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { PhotoController } from './photo.controller';
import { TinifyService } from './tinify.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoEntity } from './dto/photo.dto';

@Module({
  imports: [TypeOrmModule.forFeature([PhotoEntity])],
  providers: [PhotoService, TinifyService],
  exports: [PhotoService],
  controllers: [PhotoController],
})
export class PhotoModule {}
