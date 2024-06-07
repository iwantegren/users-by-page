import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TokenModule } from './token/token.module';
import { UsersModule } from './users/users.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { StatusResponseInterceptor } from './interceptors/response-status.interceptor';

@Module({
  imports: [TokenModule, UsersModule],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: StatusResponseInterceptor,
    },
  ],
})
export class AppModule {}
