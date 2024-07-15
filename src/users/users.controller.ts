import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TokenGuard } from 'src/token/token.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { ReadPageDto } from './dto/read-page.dto';
import { ReadUserDto } from './dto/read-user.dto';
import { PositiveNumberPipe } from './pipes/positive-number.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { PhotoService } from 'src/photo/photo.service';
import { HostUrl, ReqUrl } from 'src/decorators/url.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly service: UsersService,
    private readonly photoService: PhotoService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(TokenGuard)
  async registerUser(
    @UploadedFile() file: Express.Multer.File,
    @Body() user: CreateUserDto,
  ) {
    await this.photoService.validate(file);
    const createdUser = await this.service.createUserAndPhoto(user, file);

    return {
      user_id: createdUser.id,
      message: 'New user successfully registered',
    };
  }

  @Get()
  async getUsersPage(
    @Query('page', ParseIntPipe, PositiveNumberPipe) page: any,
    @Query('count', new DefaultValuePipe(5), ParseIntPipe, PositiveNumberPipe)
    count: any,
    @ReqUrl() reqUrl: string,
    @HostUrl() hostUrl: string,
  ): Promise<ReadPageDto> {
    const { users, meta } = await this.service.readPage(page, count);

    const next_url =
      meta.currentPage < meta.totalPages
        ? `${reqUrl}?page=${meta.currentPage + 1}&count=${count}`
        : null;

    const prev_url =
      meta.currentPage > 1
        ? `${reqUrl}?page=${meta.currentPage - 1}&count=${count}`
        : null;

    return {
      page: meta.currentPage,
      total_pages: meta.totalPages,
      total_users: meta.totalItems,
      count: meta.itemCount,
      links: { next_url, prev_url },
      users: users.map((user) => ({
        ...user,
        photo: PhotoService.getPhotoUrl(hostUrl, user.photo),
      })),
    };
  }

  @Get(':id')
  async getUserById(
    @Param('id', PositiveNumberPipe) id: number,
    @HostUrl() hostUrl: string,
  ): Promise<{ user: ReadUserDto }> {
    const user = await this.service.readById(id);
    return {
      user: { ...user, photo: PhotoService.getPhotoUrl(hostUrl, user.photo) },
    };
  }
}
