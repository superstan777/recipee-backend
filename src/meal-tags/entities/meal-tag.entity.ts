import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Meal } from '../../meals/entities/meal.entity';
import { SidebarTag } from '../../sidebar-tags/entities/sidebar_tag.entity';

@Entity('meal_tags')
@Unique(['meal', 'tag'])
export class MealTag {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Meal, (meal) => meal.meal_tags, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'meal_id' })
  meal: Meal;

  @ManyToOne(() => SidebarTag, (tag) => tag.meal_tags, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tag_id' })
  tag: SidebarTag;
}
