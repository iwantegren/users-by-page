import { BadRequestException, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as sharp from 'sharp';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { TinifyService } from './tinify.service';

@Injectable()
export class PhotoService {
  private readonly photosDir: string;
  private readonly requiredSize = 70;

  constructor(private readonly tinifyService: TinifyService) {
    this.photosDir = path.join(__dirname, '..', '..', 'images', 'users');
  }

  async validate(file: Express.Multer.File) {
    if (!file || !file.buffer) {
      throw new BadRequestException('photo is required');
    }

    const MAX_SIZE = 5 * 1024 * 1024; // 5mb
    if (file.size > MAX_SIZE) {
      throw new BadRequestException('photo should be less than 5MB');
    }

    let metadata: sharp.Metadata;
    try {
      metadata = await sharp(file.buffer).metadata();
    } catch (error) {
      throw new BadRequestException(`photo is invalid ${error}`);
    }

    if (!['jpg', 'jpeg'].includes(metadata.format)) {
      throw new BadRequestException('photo should be JPG/JPEG format');
    }

    if (
      metadata.width < this.requiredSize ||
      metadata.height < this.requiredSize
    ) {
      throw new BadRequestException(
        `Image should be more than ${this.requiredSize}x${this.requiredSize} pixels`,
      );
    }
  }

  async load(filename: string): Promise<Buffer> {
    return fs.promises.readFile(path.join(this.photosDir, filename));
  }

  async save(file: Express.Multer.File, user: CreateUserDto): Promise<string> {
    const final = `photo-${user.email}${path.extname(file.originalname)}`;

    const raw = final + '.raw';
    await this.saveToFile(file, path.join(this.photosDir, raw));

    const crop = raw + '.crop';
    await this.tinifyService.crop(
      path.join(this.photosDir, raw),
      path.join(this.photosDir, crop),
      this.requiredSize,
      this.requiredSize,
    );

    await this.tinifyService.optimize(
      path.join(this.photosDir, crop),
      path.join(this.photosDir, final),
    );

    this.delete(raw);
    this.delete(crop);

    return final;
  }

  private async saveToFile(file: Express.Multer.File, dst: string) {
    if (!fs.existsSync(this.photosDir)) {
      fs.mkdirSync(this.photosDir, { recursive: true });
    }

    await fs.promises.writeFile(dst, file.buffer);
  }

  delete(filename: string) {
    fs.rmSync(path.join(this.photosDir, filename));
  }
}
