import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { PositionsModule } from 'src/positions/positions.module';
import { DatabaseModule } from 'src/database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PositionsModule,
    DatabaseModule,
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
