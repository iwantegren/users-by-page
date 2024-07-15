import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export class PhotoDto {
  @Column({ unique: true })
  name: string;

  @Column({ type: 'bytea' })
  photo: Buffer;
}

@Entity()
export class PhotoEntity extends PhotoDto {
  @PrimaryGeneratedColumn()
  id: number;
}
