import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TokenGuard } from 'src/token/token.guard';

@Controller('users')
export class UsersController {
  @Post()
  @UseGuards(TokenGuard)
  registerUser(@Body() user: any) {
    return { ...user };
  }
}
