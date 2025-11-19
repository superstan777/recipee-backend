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
    @Body() body: { userId: number; mealIds: number[] },
  ) {
    const { userId, mealIds } = body;
    return this.mealStatusesService.getStatusesForMeals(userId, mealIds);
  }

  // -----------------------------------
  // PATCH rate
  // /meal-statuses/:mealId/rate
  // body: { userId: number, rating: number | null }
  // -----------------------------------
  @Patch(':mealId/rate')
  async rateMeal(
    @Param('mealId') mealId: number,
    @Body() body: { userId: number; rating: number | null },
  ) {
    return this.mealStatusesService.rateMeal(body.userId, mealId, body.rating);
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
  @Patch(':mealId/seen')
  async markAsSeen(
    @Param('mealId') mealId: number,
    @Body() body: { userId: number },
  ) {
    return this.mealStatusesService.markAsSeen(body.userId, mealId);
  }
}
