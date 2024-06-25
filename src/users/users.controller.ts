import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TokenGuard } from 'src/token/token.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { ReadPageDto } from './dto/read-page.dto';
import { ReadUserDto } from './dto/read-user.dto';
import { PositiveNumberPipe } from './pipes/positive-number.pipe';
import { Request } from 'express';

const path = 'users';

@Controller(path)
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
    @Req() req: Request,
  ): Promise<ReadPageDto> {
    const { users, meta } = await this.service.readPage(page, count);

    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}/${path}`;
    const next_url =
      meta.currentPage < meta.totalPages
        ? `${baseUrl}?page=${meta.currentPage + 1}&count=${count}`
        : null;

    const prev_url =
      meta.currentPage > 1
        ? `${baseUrl}?page=${meta.currentPage - 1}&count=${count}`
        : null;

    return {
      page: meta.currentPage,
      total_pages: meta.totalPages,
      total_users: meta.totalItems,
      count: meta.itemCount,
      links: { next_url, prev_url },
      users,
    };
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
