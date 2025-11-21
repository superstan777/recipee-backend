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
      if (!item.image) continue;

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
          ingredients_id: item.ingredients_id, // 🔥 dodane
        });

        await this.mealsRepo.save(newMeal);

        const newImage = this.imagesRepo.create({
          url: item.image,
          meal: newMeal,
        });

        await this.imagesRepo.save(newImage);
      }
    }
  }
}
