import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { MealType } from '../../meal-types/entities/meal_types.entity';
import { MealSidebarTag } from '../../meal-sidebar-tags/entities/meal_sidebar_tag.entity';

@Entity('sidebar_tags')
export class SidebarTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  meal_type_id: number;

  @ManyToOne(() => MealType, (mt) => mt.sidebar_tags, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'meal_type_id' })
  meal_type: MealType;

  @Column()
  tag_name: string;

  @OneToMany(() => MealSidebarTag, (mst) => mst.tag)
  meal_sidebar_tags: MealSidebarTag[];
}
