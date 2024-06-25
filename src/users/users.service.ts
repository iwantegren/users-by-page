import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, UserEntity } from './dto/create-user.dto';
import { ReadPageDto } from './dto/read-page.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { ReadUserDto } from './dto/read-user.dto';
import { PositionsService } from 'src/positions/positions.service';

const UNIQUE_VIOLATION_CODE = '23505';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private repo: Repository<UserEntity>,
    private readonly positionService: PositionsService,
  ) {}

  async createUser(user: CreateUserDto): Promise<UserEntity> {
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

  async findAll(): Promise<UserEntity[]> {
    return this.repo.find();
  }

  async readPage(page: number, count: number): Promise<ReadPageDto> {
    return {
      page,
      total_pages: -1,
      total_users: -1,
      count,
      links: { next_url: 'next.com', prev_url: null },
      users: [],
    };
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
