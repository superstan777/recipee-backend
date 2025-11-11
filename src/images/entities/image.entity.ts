import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Meal } from '../../meals/entities/meal.entity';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  serving_id: number;

  @ManyToOne(() => Meal, (m) => m.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'serving_id' })
  meal: Meal;

  @Column()
  url: string;

  @Column({ nullable: true })
  local_path: string;
}
