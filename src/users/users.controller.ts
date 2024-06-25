import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
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
      user_id: (await this.service.createUser(user)).id,
      message: 'New user successfully registered',
    };
  }

  @Get()
  async getUsersPage(
    @Query('page', ParseIntPipe, PositiveNumberPipe) page: any,
    @Query('count', new DefaultValuePipe(5), ParseIntPipe, PositiveNumberPipe)
    count: any,
  ): Promise<ReadPageDto> {
    return await this.service.readPage(page, count);
  }

  @Get('all')
  async getAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async getUserById(
    @Param('id', PositiveNumberPipe) id: number,
  ): Promise<{ user: ReadUserDto }> {
    return {
      user: await this.service.readById(id),
    };
  }
}
