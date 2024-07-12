import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as path from 'path';
import * as sharp from 'sharp';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { TinifyService } from './tinify.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPhotoDto, UserPhotoEntity } from './dto/user-photo.dto';
import { Repository } from 'typeorm';

@Injectable()
export class PhotoService {
  private readonly photosDir: string;
  private readonly requiredSize = 70;

  constructor(
    @InjectRepository(UserPhotoEntity)
    private readonly repo: Repository<UserPhotoEntity>,
    private readonly tinifyService: TinifyService,
  ) {
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

  async process(file: Buffer) {
    return await this.tinifyService.crop(
      file,
      this.requiredSize,
      this.requiredSize,
    );
  }

  async save(file: Express.Multer.File, user: CreateUserDto, process = true) {
    const filename = this.getPhotoFilename(file, user);
    const photo = process
      ? Buffer.from(await this.process(file.buffer))
      : file.buffer;

    const userPhoto: UserPhotoDto = { name: filename, photo };
    await this.repo.save(userPhoto);
    return filename;
  }

  async load(name: string): Promise<Buffer> {
    const userPhoto = await this.repo.findOne({ where: { name } });
    if (!userPhoto) {
      throw new NotFoundException('Photo is missing in database');
    }
    return userPhoto.photo;
  }

  getPhotoUrl(hostUrl: string, filename: string) {
    return `${hostUrl}/images/users/${filename}`;
  }

  getPhotoFilename(file: Express.Multer.File, user: CreateUserDto) {
    return `${user.email}-photo${path.extname(file.originalname)}`;
  }
}
