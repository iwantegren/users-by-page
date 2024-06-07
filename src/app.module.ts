import { Module, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { TokenModule } from './token/token.module';
import { UsersModule } from './users/users.module';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { StatusResponseInterceptor } from './interceptors/response-status.interceptor';
import { StatusExceptionFilter } from './filters/status-exception.filter';

@Module({
  imports: [TokenModule, UsersModule],
  providers: [
    AppService,
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
