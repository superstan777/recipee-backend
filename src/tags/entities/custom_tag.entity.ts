import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('custom_tags')
export class CustomTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}
