import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MealsService } from './meals.service';

@Injectable()
export class MealsCronService {
  constructor(private readonly mealsService: MealsService) {}

  @Cron('0 0 3 * * *')
  async handleCron() {
    console.log('Running nightly meals fetch at 3:00 AM...');
    try {
      const results = await this.mealsService.fetchAndStoreMeals();
      console.log(
        `Nightly meals fetch completed. Fetched ${results.length} meals.`,
      );
    } catch (err) {
      console.error('Error in nightly meals fetch:', err);
    }
  }
}
