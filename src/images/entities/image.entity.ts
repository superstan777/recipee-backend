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
  meal_id: number;

  @ManyToOne(() => Meal, (meal) => meal.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'meal_id', referencedColumnName: 'id' }) // wskazuje na Meal.id
  meal: Meal;

  @Column()
  url: string;

  @Column({ type: 'text', nullable: true })
  local_path: string | null;
}
