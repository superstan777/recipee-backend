import { Injectable } from '@nestjs/common';
import { MealsStorageService } from './services/meals-storage.service';
import { MealsQueryService } from './services/meals-query.service';
import { FetchedMeal } from './interfaces/meals.interfaces';

@Injectable()
export class MealsService {
  constructor(
    private readonly storageService: MealsStorageService,
    private readonly queryService: MealsQueryService,
  ) {}

  async storeMeals(fetchedMeals: FetchedMeal[]): Promise<void> {
    await this.storageService.saveFetchedMeals(fetchedMeals);
  }

  async getMealsCursor(params: {
    mealTypeId?: string;
    tagId?: string;
    cursor?: string;
    limit: number;
  }) {
    return this.queryService.getMeals(params);
  }

  async hideMeal(mealId: number, hidden: boolean = true) {
    return this.storageService.hideMeal(mealId, hidden);
  }

  async markAsSeen(mealId: number) {
    return this.storageService.markAsSeen(mealId);
  }
}
