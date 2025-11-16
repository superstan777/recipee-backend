import {
  Controller,
  Get,
  Query,
  Patch,
  Param,
  Body,
  Post,
} from '@nestjs/common';
import { MealsQueryService } from './services/meals-query.service';
import { MealsService } from './meals.service';
import { FetchedMeal } from './interfaces/meals.interfaces';

@Controller('meals')
export class MealsController {
  constructor(
    private mealsQueryService: MealsQueryService,
    private mealsService: MealsService,
  ) {}

  @Get()
  getMeals(
    @Query('mealTypeId') mealTypeId?: string,
    @Query('tagId') tagId?: string,
    @Query('limit') limit: string = '30',
    @Query('cursor') cursor?: string,
  ) {
    return this.mealsQueryService.getMeals({
      mealTypeId,
      tagId,
      cursor,
      limit: parseInt(limit, 10),
    });
  }

  @Patch(':mealId/hide')
  async hideMeal(
    @Param('mealId') mealId: number,
    @Body('hidden') hidden: boolean = true,
  ) {
    const meal = await this.mealsService.hideMeal(mealId, hidden);
    return { success: true, meal };
  }

  @Patch(':mealId/seen')
  async markAsSeen(@Param('mealId') mealId: number) {
    const meal = await this.mealsService.markAsSeen(mealId);
    return { success: true, meal };
  }

  // Nowy POST endpoint do zapisu pobranych danych
  @Post('add-meals')
  async addMeals(@Body() fetchedMeals: FetchedMeal[]) {
    await this.mealsService.storeMeals(fetchedMeals);
    return { success: true, message: 'Meals saved successfully' };
  }
}
