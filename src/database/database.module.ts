import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/dto/create-user.dto';
import { PositionEntity } from 'src/positions/dto/position.dto';
import { PhotoEntity } from 'src/photo/dto/photo.dto';

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const url = configService.getOrThrow<string>('POSTGRESQL_URL');

  return {
    type: 'postgres',
    url,
    entities: [UserEntity, PositionEntity, PhotoEntity],
    synchronize: true,
    ssl: {
      rejectUnauthorized: false,
    },
  };
};

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
