import { Entity, Column, OneToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { Meal } from 'src/meals/entities/meal.entity';

@Entity('ingredients')
export class Ingredients {
  @PrimaryColumn()
  meal_id: number;

  @Column({ type: 'simple-json' })
  ingredients: string[];

  @OneToOne(() => Meal, (meal) => meal.ingredients)
  @JoinColumn({ name: 'meal_id', referencedColumnName: 'id' })
  meal: Meal;
}
