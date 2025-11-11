import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Meal } from '../../meals/entities/meal.entity';
import { CustomTag } from './custom_tag.entity';

@Entity('meal_custom_tags')
export class MealCustomTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  serving_id: number;

  @ManyToOne(() => Meal, (m) => m.custom_tags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'serving_id' })
  meal: Meal;

  @Column()
  tag_id: number;

  @ManyToOne(() => CustomTag, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tag_id' })
  tag: CustomTag;
}
