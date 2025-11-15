import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { MealType } from '../../meal-types/entities/meal_types.entity';
import { Image } from '../../images/entities/image.entity';
import { MealTag } from '../../meal-tags/entities/meal-tag.entity';

export type Rating = 'good' | 'bad' | null;

@Entity('meals')
export class Meal {
  @PrimaryGeneratedColumn()
  pagination_id: number;

  @Column({ unique: true })
  id: number;

  @Column()
  name: string;

  @Column()
  meal_type_id: number;

  @ManyToOne(() => MealType, (mt) => mt.meals, {
    eager: false,
    nullable: false,
  })
  @JoinColumn({ name: 'meal_type_id' })
  meal_type: MealType;

  @Column({ default: false })
  hidden: boolean;

  @Column({ default: false })
  done: boolean;

  @Column({ type: 'text', nullable: true })
  rating: Rating;

  @Column({ default: true })
  new: boolean;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Image, (img) => img.meal)
  images: Image[];

  @OneToMany(() => MealTag, (mealTag) => mealTag.meal)
  meal_tags: MealTag[];
}
