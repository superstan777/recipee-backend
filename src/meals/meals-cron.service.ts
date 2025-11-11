import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MealsService } from './meals.service';

@Injectable()
export class MealsCronService {
  constructor(private readonly mealsService: MealsService) {}

  @Cron('0 1 * * *') // codziennie o 1:00 w nocy
  async handleCron() {
    console.log('🌙 Running nightly meals fetch...');
    try {
      await this.mealsService.fetchMeals();
      console.log('✅ Nightly meals fetch completed');
    } catch (err) {
      console.error('❌ Error in nightly meals fetch:', err);
    }
  }
}
