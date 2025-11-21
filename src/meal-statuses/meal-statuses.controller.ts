import { Controller, Patch, Post, Body, Param } from '@nestjs/common';
import { MealStatusesService } from './meal-statuses.service';

@Controller('meal-statuses')
export class MealStatusesController {
  constructor(private readonly mealStatusesService: MealStatusesService) {}

  // -----------------------------------
  // POST statuses for many meals (body-based)
  // /meal-statuses/batch
  // body: { userId: number, mealIds: number[] }
  // -----------------------------------
  @Post('batch')
  async getStatusesForMeals(
    @Body() body: { user_id: number; meal_ids: number[] },
  ) {
    const { user_id, meal_ids } = body;
    return this.mealStatusesService.getStatusesForMeals(user_id, meal_ids);
  }

  // -----------------------------------
  // PATCH rate
  // /meal-statuses/:mealId/rate
  // body: { userId: number, rating: number | null }
  // -----------------------------------
  @Patch('rate')
  async rateMeal(
    @Body() body: { user_id: number; meal_id: number; rating: number | null },
  ) {
    const { user_id, meal_id, rating } = body;
    return this.mealStatusesService.rateMeal(user_id, meal_id, rating);
  }

  // -----------------------------------
  // PATCH hide
  // /meal-statuses/:mealId/hide
  // body: { userId: number }
  // -----------------------------------
  @Patch('hide')
  async hideMeal(@Body() body: { user_id: number; meal_id: number }) {
    const { user_id, meal_id } = body;
    return this.mealStatusesService.hideMeal(user_id, meal_id);
  }

  // -----------------------------------
  // PATCH mark as seen
  // /meal-statuses/:mealId/seen
  // body: { userId: number }
  // -----------------------------------
  @Patch(':meal_id/seen')
  async markAsSeen(
    @Param('meal_id') meal_id: number,
    @Body() body: { user_id: number },
  ) {
    return this.mealStatusesService.markAsSeen(body.user_id, meal_id);
  }
}
