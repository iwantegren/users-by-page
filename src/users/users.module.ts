import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TokenModule } from 'src/token/token.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './dto/create-user.dto';
import { PhotoModule } from 'src/photo/photo.module';
import { PhotoEntity } from 'src/photo/dto/photo.dto';

@Module({
  imports: [
    TokenModule,
    TypeOrmModule.forFeature([UserEntity, PhotoEntity]),
    PhotoModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
