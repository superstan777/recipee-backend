import { Controller, Get, Query, Patch, Param, Body } from '@nestjs/common';
import { MealsService } from './meals.service';

@Controller('meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Get()
  async getMeals(
    @Query('cursor') cursor?: string, // cursor = id ostatniego posiłku
    @Query('limit') limit: string = '30',
  ) {
    const limitNumber = parseInt(limit, 10);
    return this.mealsService.getMealsCursor({ cursor, limit: limitNumber });
  }

  @Patch(':mealId/hide')
  async hideMeal(
    @Param('mealId') mealId: number,
    @Body('hidden') hidden: boolean = true,
  ) {
    const updatedMeal = await this.mealsService.hideMeal(mealId, hidden);
    return { success: true, meal: updatedMeal };
  }
}
