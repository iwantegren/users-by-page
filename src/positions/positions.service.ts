import { ConflictException, Injectable } from '@nestjs/common';
import { PositionDto } from './dto/position.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

const UNIQUE_VIOLATION_CODE = '23505';

@Injectable()
export class PositionsService {
  private positions: PositionDto[] = [];

  constructor(
    @InjectRepository(PositionDto) private repo: Repository<PositionDto>,
  ) {}

  async addPosition(name: string): Promise<PositionDto> {
    try {
      const newRecord = this.repo.create({ name });
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

  async getPositions(): Promise<PositionDto[]> {
    if (this.positions.length === 0) {
      this.positions = await this.repo.find();
    }

    return this.positions;
  }

  async getName(id: number): Promise<string | undefined> {
    return this.positions.find((pos) => pos.id === id)?.name ?? undefined;
  }
}
