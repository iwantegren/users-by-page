import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import tinify from 'tinify';

@Injectable()
export class TinifyService {
  constructor(private readonly configService: ConfigService) {
    tinify.key = configService.getOrThrow<string>('TINIFY_API_KEY');
  }

  async crop(
    file: Uint8Array,
    width: number,
    height: number,
  ): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      tinify
        .fromBuffer(file)
        .resize({
          method: 'cover',
          width,
          height,
        })
        .toBuffer((err, resultBuffer) => {
          if (err) {
            return reject(new BadRequestException('Image cropping failed'));
          }
          resolve(resultBuffer);
        });
    });
  }
}
