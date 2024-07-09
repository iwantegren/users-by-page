import { Module, ValidationPipe } from '@nestjs/common';
import { TokenModule } from './token/token.module';
import { UsersModule } from './users/users.module';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { StatusResponseInterceptor } from './interceptors/response-status.interceptor';
import { StatusExceptionFilter } from './filters/status-exception.filter';
import { PositionsModule } from './positions/positions.module';
import { ConfigModule } from '@nestjs/config';
import { PhotoModule } from './photo/photo.module';
import { DatabaseModule } from './database/database.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    UsersModule,
    TokenModule,
    PositionsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PhotoModule,
    DatabaseModule,
    SeedModule,
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
