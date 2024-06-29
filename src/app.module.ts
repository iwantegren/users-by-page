import { Module, ValidationPipe } from '@nestjs/common';
import { TokenModule } from './token/token.module';
import { UsersModule } from './users/users.module';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { StatusResponseInterceptor } from './interceptors/response-status.interceptor';
import { StatusExceptionFilter } from './filters/status-exception.filter';
import { PositionsModule } from './positions/positions.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from './users/dto/create-user.dto';
import { PositionDto } from './positions/dto/position.dto';
import { PhotoModule } from './photo/photo.module';

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
    UsersModule,
    TokenModule,
    PositionsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    PhotoModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: StatusResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: StatusExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
        }),
    },
  ],
})
export class AppModule {}
