import { CreateUserDto } from './create-user.dto';

export class ReadUserDto extends CreateUserDto {
  id: number;
  position: string;
  photo: string;
}
