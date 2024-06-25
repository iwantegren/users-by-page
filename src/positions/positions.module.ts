import { Module } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { PositionsController } from './positions.controller';
import { IsPositionIdConstraint } from './position.validator';

@Module({
  providers: [PositionsService, IsPositionIdConstraint],
  controllers: [PositionsController],
  exports: [PositionsService],
})
export class PositionsModule {}
