import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { Meal } from 'src/meals/entities/meal.entity';

@Entity('recipes')
export class Recipe {
  @PrimaryColumn()
  meal_id: number;

  @Column({ type: 'simple-json' })
  ingredients: string[];

  @Column({ type: 'simple-json' })
  instructions: any[];

  @OneToOne(() => Meal, (meal) => meal.recipe)
  @JoinColumn({ name: 'meal_id', referencedColumnName: 'id' })
  meal: Meal;
}
