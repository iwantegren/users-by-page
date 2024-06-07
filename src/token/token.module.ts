import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import TokenService from './token.service';
import TokenStorageService from './token-storage.service';
import { TokenGuard } from './token.guard';

@Module({
  providers: [TokenService, TokenStorageService, TokenGuard],
  controllers: [TokenController],
  exports: [TokenService, TokenGuard],
})
export class TokenModule {}
