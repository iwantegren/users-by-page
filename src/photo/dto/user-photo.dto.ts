import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export class UserPhotoDto {
  @Column({ unique: true })
  name: string;

  @Column({ type: 'bytea' })
  photo: Buffer;
}

@Entity()
export class UserPhotoEntity extends UserPhotoDto {
  @PrimaryGeneratedColumn()
  id: number;
}
