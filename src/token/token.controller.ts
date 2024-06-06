import { Controller, Get, UseGuards } from '@nestjs/common';
import TokenService from './token.service';
import { TokenGuard } from './token.guard';

@Controller('token')
export class TokenController {
  constructor(private readonly service: TokenService) {}

  @Get()
  getToken() {
    return this.service.create();
  }

  @Get('reg')
  @UseGuards(TokenGuard)
  dummy() {
    return 'Access granted';
  }
}
