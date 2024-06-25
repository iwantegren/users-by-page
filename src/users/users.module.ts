import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TokenModule } from 'src/token/token.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './dto/create-user.dto';
import { PositionsModule } from 'src/positions/positions.module';

@Module({
  imports: [
    TokenModule,
    TypeOrmModule.forFeature([UserEntity]),
    PositionsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
