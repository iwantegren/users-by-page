import { Controller, Get } from '@nestjs/common';
import { TokenService } from './token.service';

@Controller('token')
export class TokenController {
  constructor(private readonly service: TokenService) {}

  @Get()
  async getToken() {
    return { token: await this.service.create() };
  }
}
