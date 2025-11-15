import { Injectable, OnModuleInit } from '@nestjs/common';
import { MealsFetchService } from './services/meals-fetch.service';
import { MealsStorageService } from './services/meals-storage.service';
import { MealsQueryService } from './services/meals-query.service';

@Injectable()
export class MealsService implements OnModuleInit {
  constructor(
    private readonly fetchService: MealsFetchService,
    private readonly storageService: MealsStorageService,
    private readonly queryService: MealsQueryService,
  ) {}

  async onModuleInit() {
    console.log('Fetching meals on app start...');
    try {
      await this.fetchAndStoreMeals();
      console.log('Meals fetched and saved successfully');
    } catch (err) {
      console.error('Error fetching meals on app start:', err);
    }
  }

  async fetchAndStoreMeals() {
    const fetched = await this.fetchService.fetchMealsFromApi();
    await this.storageService.saveFetchedMeals(fetched);
    return fetched;
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
