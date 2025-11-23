import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { MealType } from '../../meal-types/entities/meal_types.entity';
import { Image } from '../../images/entities/image.entity';
import { MealTag } from '../../meal-tags/entities/meal-tag.entity';
import { Ingredients } from 'src/ingredients/entities/ingredients.entity';
import { Recipe } from 'src/recipes/entities/recipe.entity';

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

  @Column({ type: 'int', nullable: true })
  rating: number | null;

  @Column({ default: true })
  new: boolean;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'varchar', length: 32 })
  ingredients_id: string;

  @OneToMany(() => Image, (img) => img.meal)
  images: Image[];

  @OneToMany(() => MealTag, (mealTag) => mealTag.meal)
  meal_tags: MealTag[];

  @OneToOne(() => Ingredients, (ingredients) => ingredients.meal, {
    cascade: true,
  })
  ingredients: Ingredients;
  @OneToOne(() => Recipe, (recipe) => recipe.meal, { cascade: true })
  recipe: Recipe;
}
