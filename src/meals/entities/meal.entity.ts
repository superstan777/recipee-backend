import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { MealType } from 'src/meal-types/entities/meal_types.entity';
import { Image } from 'src/images/entities/image.entity';
import { MealSidebarTag } from 'src/meal-sidebar-tags/entities/meal_sidebar_tag.entity';

export type Rating = 'good' | 'bad' | null;

@Entity('meals')
export class Meal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  meal_id: number;

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

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Image, (img) => img.meal)
  images: Image[];

  @OneToMany(() => MealSidebarTag, (mst) => mst.meal)
  sidebar_tags: MealSidebarTag[];
}
