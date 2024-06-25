import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PositionDto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
