import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, UserEntity } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { ReadUserDto } from './dto/read-user.dto';
import { PositionsService } from 'src/positions/positions.service';
import { IPaginationMeta, paginate } from 'nestjs-typeorm-paginate';

const UNIQUE_VIOLATION_CODE = '23505';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private repo: Repository<UserEntity>,
    private readonly positionService: PositionsService,
  ) {}

  async createUser(
    user: CreateUserDto & { photo: string },
  ): Promise<UserEntity> {
    try {
      const newRecord = this.repo.create(user);
      return await this.repo.save(newRecord);
    } catch (error) {
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
    }
  }

  async readPage(
    page: number,
    count: number,
  ): Promise<{ users: ReadUserDto[]; meta: IPaginationMeta }> {
    const queryBuilder = this.repo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.position', 'position');

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
      photo: user.photo,
      position_id: user.position.id,
      position: user.position.name,
    }));

    return { users, meta };
  }

  async readById(id: number): Promise<ReadUserDto> {
    const user = await this.repo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.position', 'position')
      .select([
        'user.id as id',
        'user.name as name',
        'user.email as email',
        'user.phone as phone',
        'user.photo as photo',
        'user.position_id as position_id',
        'position.name as position',
      ])
      .where('user.id = :id', { id })
      .getRawOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user as ReadUserDto;
  }
}
