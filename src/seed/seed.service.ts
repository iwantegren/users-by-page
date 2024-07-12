import { ConflictException, Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PositionsService } from 'src/positions/positions.service';
import * as faker from 'faker';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { PhotoService } from 'src/photo/photo.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);
  private readonly baseUrl: string;

  constructor(
    private readonly positionsService: PositionsService,
    private readonly usersService: UsersService,
    private readonly photoService: PhotoService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = configService.get('BACKEND_URL') ?? '';
    if (this.baseUrl === '') {
      this.logger.error(
        'Base URL is not specified. Photos could be unaccessible',
      );
    }
  }

  async seedPositions() {
    const filePath = path.join(__dirname, '..', '..', 'res', 'positions.txt');
    const positions = fs.readFileSync(filePath, 'utf-8').split('\n');

    for (const position of positions) {
      if (position.trim()) {
        try {
          await this.positionsService.addPosition(position.trim());
        } catch (error) {
          if (error instanceof ConflictException) {
            this.logger.warn(error);
          } else {
            this.logger.error(
              `Unexpected error while seeding positions: ${error}`,
            );
          }
        }
      }
    }
  }

  private async loadAsMulterFile(
    filename: string,
  ): Promise<Express.Multer.File> {
    const buffer = await fs.promises.readFile(
      path.join(__dirname, '..', '..', 'res', filename),
    );

    const file: Express.Multer.File = {
      fieldname: 'file',
      originalname: filename,
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: buffer.length,
      buffer,
      stream: null,
      destination: '',
      filename,
      path: path.join(__dirname, filename),
    };

    return file;
  }

  async seedUsers() {
    const userCount = 45;
    const file = await this.loadAsMulterFile('fake.jpg');

    for (let i = 0; i < userCount; i++) {
      const user: CreateUserDto = {
        name: faker.name.findName(),
        email: faker.internet.email(),
        phone: faker.phone.phoneNumber('+380#########'),
        position_id: faker.random.arrayElement([1, 2, 3, 4]), // Assuming these positions exist
      };

      const filename = await this.photoService.save(file, user);

      try {
        await this.usersService.createUser({
          ...user,
          photo: this.photoService.getPhotoUrl(this.baseUrl, filename),
        });
      } catch (error) {
        if (error instanceof ConflictException) {
          this.logger.warn(error);
        } else {
          this.logger.error(
            `Unexpected error while seeding positions: ${error}`,
          );
        }
      }
    }
  }
}
