import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Meal } from '../../meals/entities/meal.entity';
import { SidebarTag } from '../../sidebar-tags/entities/sidebar_tag.entity';

@Entity('meal_sidebar_tags')
@Unique(['meal_id', 'tag_id'])
export class MealSidebarTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  meal_id: number;

  @ManyToOne(() => Meal, (meal) => meal.sidebar_tags, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'meal_id' })
  meal: Meal;

  @Column()
  tag_id: number;

  @ManyToOne(() => SidebarTag, (tag) => tag.meal_sidebar_tags, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tag_id' })
  tag: SidebarTag;
}
