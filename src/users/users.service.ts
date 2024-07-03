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
    const { items, meta } = await paginate<UserEntity>(this.repo, {
      page,
      limit: count,
    });

    if (items.length === 0 && page !== 1)
      throw new NotFoundException('Page not found');

    const users = await Promise.all(
      items.map(async (item) => ({
        ...item,
        position: await this.positionService.getName(item.position_id),
      })),
    );

    console.log({ users });

    return { users, meta };
  }

  async readById(id: number): Promise<ReadUserDto> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    return {
      ...user,
      position: await this.positionService.getName(user.position_id),
    };
  }
}
