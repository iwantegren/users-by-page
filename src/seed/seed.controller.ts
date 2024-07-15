import {
  Controller,
  DefaultValuePipe,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SeedKeyGuard } from './seed.guard';
import { SeedService } from './seed.service';
import { PositiveNumberPipe } from 'src/users/pipes/positive-number.pipe';

@Controller('seed')
export class SeedController {
  constructor(private readonly service: SeedService) {}

  @Post('positions')
  @UseGuards(SeedKeyGuard)
  async seedPositions() {
    await this.service.seedPositions();
  }

  @Post('users')
  @UseGuards(SeedKeyGuard)
  async seedUsers(
    @Query('count', new DefaultValuePipe(45), ParseIntPipe, PositiveNumberPipe)
    count,
  ) {
    await this.service.seedUsers(count);
  }
}
