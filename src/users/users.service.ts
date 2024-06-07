import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  async createUser(user: CreateUserDto): Promise<number> {
    console.log(user);
    return 23;
  }
}
