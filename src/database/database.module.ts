import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/dto/create-user.dto';
import { PositionDto } from 'src/positions/dto/position.dto';

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.getOrThrow<string>('PGSQL_HOST'),
  port: configService.getOrThrow<number>('PGSQL_PORT'),
  username: configService.getOrThrow<string>('PGSQL_USER'),
  password: configService.getOrThrow<string>('PGSQL_PASSWORD'),
  database: configService.getOrThrow<string>('PGSQL_DBNAME'),
  entities: [UserEntity, PositionDto],
  synchronize: true,
});

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
