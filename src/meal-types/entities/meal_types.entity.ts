import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Meal } from 'src/meals/entities/meal.entity';
import { SidebarTag } from 'src/sidebar-tags/entities/sidebar_tag.entity';

@Entity('meal_types')
export class MealType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Meal, (meal) => meal.meal_type)
  meals: Meal[];

  @OneToMany(() => SidebarTag, (st) => st.meal_type)
  sidebar_tags: SidebarTag[];
}
