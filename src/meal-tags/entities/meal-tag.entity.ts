import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Column,
} from 'typeorm';
import { Meal } from '../../meals/entities/meal.entity';
import { SidebarTag } from '../../sidebar-tags/entities/sidebar_tag.entity';
import { User } from '../../users/entities/user.entity';

@Entity('meal_tags')
@Unique(['meal', 'tag', 'user']) // 🔹 unikalność per user!
export class MealTag {
  @PrimaryGeneratedColumn()
  id: number;

  // 🔹 user_id KOLUMNA
  @Column()
  user_id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Meal, (meal) => meal.meal_tags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'meal_id', referencedColumnName: 'id' })
  meal: Meal;

  @ManyToOne(() => SidebarTag, (tag) => tag.meal_tags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tag_id' })
  tag: SidebarTag;
}
