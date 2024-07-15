import { UserEntity } from 'src/users/dto/create-user.dto';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
} from 'typeorm';

export class PositionDto {
  @Column()
  name: string;
}

@Entity()
@Unique(['name'])
export class PositionEntity extends PositionDto {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => UserEntity, (user) => user.position_id)
  users: UserEntity[];
}
