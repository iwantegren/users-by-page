import { Controller, Post, UseGuards } from '@nestjs/common';
import { SeedKeyGuard } from './seed.guard';
import { SeedService } from './seed.service';

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
  async seedUsers() {
    await this.service.seedUsers();
  }
}
