import { Controller, Get, Param, Patch, Body, Query } from '@nestjs/common';
import { MealStatusesService } from './meal-statuses.service';

@Controller('meal-statuses')
export class MealStatusesController {
  constructor(private readonly mealStatusesService: MealStatusesService) {}

  // -----------------------------------
  // GET statuses for many meals
  // /meal-statuses?userId=1&mealIds=1,2,3
  // -----------------------------------
  @Get()
  async getStatusesForMeals(
    @Query('userId') userId: number,
    @Query('mealIds') mealIds: string,
  ) {
    const ids = mealIds ? mealIds.split(',').map(Number) : [];
    return this.mealStatusesService.getStatusesForMeals(userId, ids);
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
  // PATCH hidden
  // /meal-statuses/:mealId/hidden
  // body: { userId: number, hidden: boolean }
  // -----------------------------------
  @Patch(':mealId/hidden')
  async setHidden(
    @Param('mealId') mealId: number,
    @Body() body: { userId: number },
  ) {
    return this.mealStatusesService.setHidden(body.userId, mealId);
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
