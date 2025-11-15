import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meal } from '../entities/meal.entity';
import { Image } from '../../images/entities/image.entity';
import { MealType } from '../../meal-types/entities/meal_types.entity';
import { FetchedMeal } from '../interfaces/meals.interfaces';

@Injectable()
export class MealsStorageService {
  constructor(
    @InjectRepository(Meal) private readonly mealsRepo: Repository<Meal>,
    @InjectRepository(Image) private readonly imagesRepo: Repository<Image>,
    @InjectRepository(MealType)
    private readonly mealTypeRepo: Repository<MealType>,
  ) {}

  async saveFetchedMeals(fetchedMeals: FetchedMeal[]): Promise<void> {
    for (const item of fetchedMeals) {
      const mealType = await this.mealTypeRepo.findOne({
        where: { name: item.meal_type_name },
      });

      if (!mealType)
        throw new Error(`MealType not found in DB: ${item.meal_type_name}`);

      const existingMeal = await this.mealsRepo.findOne({
        where: { id: item.meal_id },
      });

      if (!existingMeal) {
        const newMeal = this.mealsRepo.create({
          id: item.meal_id,
          name: item.name,
          meal_type_id: mealType.id,
          meal_type: mealType,
          new: true,
        });

        await this.mealsRepo.save(newMeal);

        if (item.image) {
          const newImage = this.imagesRepo.create({
            url: item.image,
            meal: newMeal,
          });
          await this.imagesRepo.save(newImage);
        }
      }
    }
  }

  async hideMeal(mealId: number, hidden: boolean = true): Promise<Meal> {
    const meal = await this.mealsRepo.findOne({ where: { id: mealId } });
    if (!meal) throw new Error(`Meal with id ${mealId} not found`);

    meal.hidden = hidden;
    return this.mealsRepo.save(meal);
  }

  async markAsSeen(mealId: number): Promise<Meal> {
    const meal = await this.mealsRepo.findOne({ where: { id: mealId } });
    if (!meal) throw new Error(`Meal with id ${mealId} not found`);

    meal.new = false;
    return this.mealsRepo.save(meal);
  }
}
