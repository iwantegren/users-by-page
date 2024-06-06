import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import TokenService from './token.service';
import TokenStorageService from './token-storage.service';

@Module({
  providers: [TokenService, TokenStorageService],
  controllers: [TokenController],
})
export class TokenModule {}
