import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import tinify from 'tinify';

@Injectable()
export class TinifyService {
  constructor(private readonly configService: ConfigService) {
    tinify.key = configService.getOrThrow<string>('TINIFY_API_KEY');
  }

  async crop(src: string, dst: string, width, height): Promise<void> {
    return new Promise((resolve, reject) => {
      tinify
        .fromFile(src)
        .resize({
          method: 'cover',
          width,
          height,
        })
        .toFile(dst, (err) => {
          if (err) {
            return reject(new BadRequestException('Image cropping failed'));
          }
          resolve();
        });
    });
  }

  async optimize(src: string, dst: string): Promise<void> {
    return new Promise((resolve, reject) => {
      tinify.fromFile(src).toFile(dst, (err) => {
        if (err) {
          return reject(new BadRequestException('Image optimization failed'));
        }
        resolve();
      });
    });
  }
}
