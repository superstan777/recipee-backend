import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
  JoinColumn,
} from 'typeorm';
import { Meal } from 'src/meals/entities/meal.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('meal_status')
@Unique(['meal', 'user'])
export class MealStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Meal, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'meal_id' })
  meal: Meal;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'integer', nullable: true })
  rating: number | null;

  @Column({ type: 'boolean', default: true })
  new: boolean;

  @Column({ type: 'boolean', default: false })
  hidden: boolean;
}
