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
    const today = new Date();
    console.log('Fetching meals on app start...');

    try {
      await this.fetchAndStoreMeals(today);
      console.log('Meals fetched and saved successfully');
    } catch (err) {
      console.error('Error fetching meals on app start:', err);
    }
  }

  async fetchAndStoreMeals(date: Date) {
    const fetched = await this.fetchService.fetchMealsFromApi(date);
    await this.storageService.saveFetchedMeals(fetched);
    return fetched;
  }

  async getMealsCursor(params: {
    mealTypeId?: string;
    tagId?: string;
    cursor?: string;
    limit: number;
    userId: number; // <-- DODANE
  }) {
    return this.queryService.getMeals(params);
  }
}
