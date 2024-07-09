import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { PositionsModule } from 'src/positions/positions.module';
import { DatabaseModule } from 'src/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { PhotoModule } from 'src/photo/photo.module';
import { SeedController } from './seed.controller';
import { SeedKeyGuard } from './seed.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PositionsModule,
    UsersModule,
    DatabaseModule,
    PhotoModule,
  ],
  providers: [SeedService, SeedKeyGuard],
  exports: [SeedService],
  controllers: [SeedController],
})
export class SeedModule {}
