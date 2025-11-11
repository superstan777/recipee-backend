import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MealType } from '../../meal-type/entities/meal_type.entity';

@Entity('sidebar_tags')
export class SidebarTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  meal_type_id: number;

  @ManyToOne(() => MealType, (mt) => mt.sidebar_tags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'meal_type_id' })
  meal_type: MealType;

  @Column()
  tag_name: string;
}
