import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, UserEntity } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { ReadUserDto } from './dto/read-user.dto';
import { IPaginationMeta, paginate } from 'nestjs-typeorm-paginate';
import { PhotoEntity } from 'src/photo/dto/photo.dto';
import { PhotoService } from 'src/photo/photo.service';

const UNIQUE_VIOLATION_CODE = '23505';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(PhotoEntity)
    private photoRepo: Repository<PhotoEntity>,
    private readonly dataSource: DataSource,
    private readonly photoService: PhotoService,
  ) {}

  async createUserAndPhoto(
    createUserDto: CreateUserDto,
    photoFile: Express.Multer.File,
  ): Promise<UserEntity> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const photoToSave = Object.assign(new PhotoEntity(), {
        ...(await this.photoService.createPhotoDto(photoFile, createUserDto)),
      });
      const savedPhoto = await queryRunner.manager.save(photoToSave);

      const userToSave: UserEntity = Object.assign(new UserEntity(), {
        ...createUserDto,
        photo: savedPhoto,
      });
      const savedUser = await queryRunner.manager.save(userToSave);

      await queryRunner.commitTransaction();

      return savedUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (
        error instanceof QueryFailedError &&
        error.driverError.code === UNIQUE_VIOLATION_CODE
      ) {
        throw new ConflictException(
          'User with this phone or email already exist',
        );
      } else {
        throw error;
      }
    } finally {
      await queryRunner.release();
    }
  }

  async readPage(
    page: number,
    count: number,
  ): Promise<{ users: ReadUserDto[]; meta: IPaginationMeta }> {
    const queryBuilder = this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.position', 'position')
      .leftJoinAndSelect('user.photo', 'photo');

    const { items, meta } = await paginate<UserEntity>(queryBuilder, {
      page,
      limit: count,
    });

    if (items.length === 0 && page !== 1) {
      throw new NotFoundException('Page not found');
    }

    const users = items.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      photo: user.photo.name,
      position_id: user.position.id,
      position: user.position.name,
    }));

    return { users, meta };
  }

  async readById(id: number): Promise<ReadUserDto> {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.position', 'position')
      .leftJoinAndSelect('user.photo', 'photo')
      .select([
        'user.id as id',
        'user.name as name',
        'user.email as email',
        'user.phone as phone',
        'user.position_id as position_id',
        'position.name as position',
        'photo.name as photo',
      ])
      .where('user.id = :id', { id })
      .getRawOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user as ReadUserDto;
  }
}
