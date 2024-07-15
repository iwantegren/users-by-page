import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { PositionEntity } from 'src/positions/dto/position.dto';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

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
  @IsNumberString()
  position_id: number;
}

@Entity()
@Unique(['email'])
@Unique(['phone'])
export class UserEntity extends CreateUserDto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  photo: string;

  @ManyToOne(() => PositionEntity, (position) => position.users)
  @JoinColumn({ name: 'position_id' })
  position: PositionEntity;
}
