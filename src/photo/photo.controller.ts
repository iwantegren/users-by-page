import {
  Controller,
  Get,
  Header,
  NotFoundException,
  Param,
  Res,
} from '@nestjs/common';
import { PhotoService } from './photo.service';
import { Response } from 'express';

@Controller('images')
export class PhotoController {
  constructor(private readonly service: PhotoService) {}

  @Get('users/:filename')
  @Header('Content-Type', 'image/jpeg')
  async getPhoto(@Param('filename') filename: string, @Res() res: Response) {
    try {
      const fileBuffer = await this.service.load(filename);
      res.send(fileBuffer);
    } catch (error) {
      throw new NotFoundException('File not found');
    }
  }
}
