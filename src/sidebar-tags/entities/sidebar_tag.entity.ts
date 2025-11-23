import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { MealType } from '../../meal-types/entities/meal_types.entity';
import { MealTag } from '../../meal-tags/entities/meal-tag.entity';
import { User } from '../../users/entities/user.entity'; // <-- NOWE

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
  user_id: number; // <-- NOWE

  @ManyToOne(() => User, (user) => user.sidebar_tags, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' }) // <-- nazwę kolumny mapujemy ręcznie
  user: User; // <-- NOWE

  @Column()
  tag_name: string;

  @OneToMany(() => MealTag, (mealTag) => mealTag.tag)
  meal_tags: MealTag[];
}
