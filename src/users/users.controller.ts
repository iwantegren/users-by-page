import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TokenGuard } from 'src/token/token.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  @UseGuards(TokenGuard)
  async registerUser(@Body() user: CreateUserDto) {
    return {
      user_id: await this.service.createUser(user),
      message: 'New user successfully registered',
    };
  }
}
