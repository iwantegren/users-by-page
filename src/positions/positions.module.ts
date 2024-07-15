import { Module } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { PositionsController } from './positions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PositionEntity } from './dto/position.dto';

@Module({
  imports: [TypeOrmModule.forFeature([PositionEntity])],
  providers: [PositionsService],
  controllers: [PositionsController],
  exports: [PositionsService],
})
export class PositionsModule {}
