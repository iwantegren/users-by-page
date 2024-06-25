import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['name'])
export class PositionDto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
