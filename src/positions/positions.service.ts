import {
  ConflictException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { PositionDto, PositionEntity } from './dto/position.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

const UNIQUE_VIOLATION_CODE = '23505';

@Injectable()
export class PositionsService implements OnModuleInit {
  private readonly logger = new Logger(PositionsService.name);
  private positions: PositionEntity[] = [];

  constructor(
    @InjectRepository(PositionEntity) private repo: Repository<PositionEntity>,
  ) {}

  async onModuleInit() {
    this.positions = await this.repo.find();
  }

  async addPosition(position: PositionDto): Promise<PositionEntity> {
    try {
      const newRecord = this.repo.create(position);
      const result = await this.repo.save(newRecord);

      this.positions.push(result);
      return result;
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError.code === UNIQUE_VIOLATION_CODE
      ) {
        throw new ConflictException('This position already exists');
      } else {
        throw error;
      }
    }
  }

  async getPositions(): Promise<PositionEntity[]> {
    this.logger.debug('Read positions');
    if (this.positions.length === 0) {
      this.positions = await this.repo.find();
    }

    return this.positions;
  }
}
