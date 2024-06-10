import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { IsPositionId } from 'src/positions/position.validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 60)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\+380\d{9}$/, {
    message: 'phone must start with the code +380 and contain 9 digits',
  })
  phone: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositionId()
  position_id: number;

  @IsNotEmpty()
  // TBD: photo handling
  photo: any;
}
