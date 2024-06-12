import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TokenGuard } from 'src/token/token.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { ReadPageDto } from './dto/read-page.dto';
import { ReadUserDto } from './dto/read-user.dto';
import { PositiveNumberPipe } from './pipes/positive-number.pipe';

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

  @Get()
  async getUsersPage(
    @Query('page', PositiveNumberPipe.withValue(undefined)) page: number,
    @Query('count', PositiveNumberPipe.withValue(5)) count: number,
  ): Promise<ReadPageDto> {
    return {
      page,
      total_pages: -1,
      total_users: -1,
      count,
      links: { next_url: 'next.com', prev_url: null },
      users: [],
    };
  }

  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<{ user: ReadUserDto }> {
    return {
      user: {
        id,
        name: 'name',
        email: 'email',
        phone: 'phone',
        position: 'position',
        position_id: 2,
        photo: 'photo',
      },
    };
  }
}
