import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/dto/create-user.dto';
import { PositionDto } from 'src/positions/dto/position.dto';

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const url = configService.getOrThrow<string>('POSTGRESQL_URL');

  return {
    type: 'postgres',
    url,
    entities: [UserEntity, PositionDto],
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
