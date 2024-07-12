import { Controller, Get, Header, Param, Res } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { Response } from 'express';

@Controller('images')
export class PhotoController {
  constructor(private readonly service: PhotoService) {}

  @Get('users/:filename')
  @Header('Content-Type', 'image/jpeg')
  async getPhoto(@Param('filename') filename: string, @Res() res: Response) {
    const fileBuffer = await this.service.load(filename);
    res.send(fileBuffer);
  }
}
