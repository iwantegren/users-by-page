import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { IsPositionId } from 'src/positions/position.validator';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

export class CreateUserDto {
  @Column()
  @IsNotEmpty()
  @IsString()
  @Length(2, 60)
  name: string;

  @Column()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  @Matches(/^\+380\d{9}$/, {
    message: 'phone must start with the code +380 and contain 9 digits',
  })
  phone: string;

  @Column()
  @IsNotEmpty()
  @IsInt()
  @IsPositionId()
  position_id: number;

  @Column()
  @IsNotEmpty()
  // TBD: photo handling
  photo: string;
}

@Entity()
@Unique(['email'])
@Unique(['phone'])
export class UserEntity extends CreateUserDto {
  @PrimaryGeneratedColumn()
  id: number;
}
