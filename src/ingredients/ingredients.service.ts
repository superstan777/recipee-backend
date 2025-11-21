import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meal } from '../meals/entities/meal.entity';
import { Ingredients } from './entities/ingredients.entity';

@Injectable()
export class IngredientsService {
  private readonly logger = new Logger(IngredientsService.name);

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Meal)
    private readonly mealsRepo: Repository<Meal>,
    @InjectRepository(Ingredients)
    private readonly ingredientsRepo: Repository<Ingredients>,
  ) {}

  async fetchAndSaveIngredients(ingredients_id: string) {
    try {
      // 1️⃣ Pobranie danych z API
      const url = `https://ntfy.pl/wp-json/dccore/v1/meal/${ingredients_id}`;
      const response = await firstValueFrom(this.httpService.get(url));
      const data = response.data;

      if (!data?.ingredients || !data.ingredients.length) {
        this.logger.warn(
          `No ingredients found for ingredients_id: ${ingredients_id}`,
        );
        return;
      }

      // 2️⃣ Znalezienie posiłku po ingredients_id
      const meal = await this.mealsRepo.findOne({ where: { ingredients_id } });
      if (!meal) {
        this.logger.warn(
          `No meal found with ingredients_id: ${ingredients_id}`,
        );
        return;
      }

      // 3️⃣ Utworzenie lub aktualizacja rekordu w tabeli ingredients
      let ingredientsRecord = await this.ingredientsRepo.findOne({
        where: { meal_id: meal.id },
      });

      if (!ingredientsRecord) {
        ingredientsRecord = this.ingredientsRepo.create({
          meal_id: meal.id,
          ingredients: data.ingredients,
        });
      } else {
        ingredientsRecord.ingredients = data.ingredients;
      }

      await this.ingredientsRepo.save(ingredientsRecord);
      this.logger.log(`Ingredients saved successfully for meal_id: ${meal.id}`);
    } catch (error) {
      this.logger.error(
        `Error fetching/saving ingredients for ${ingredients_id}`,
        error,
      );
    }
  }

  // Opcjonalnie: metoda do batchowego pobierania składników dla wielu meals
  async fetchAndSaveIngredientsBatch(ingredientsIds: string[]) {
    for (const id of ingredientsIds) {
      await this.fetchAndSaveIngredients(id);
    }
  }
}
