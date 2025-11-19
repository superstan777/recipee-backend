import { Controller, Get, Query, Patch, Param, Body } from '@nestjs/common';
import { MealsQueryService } from './services/meals-query.service';
import { MealsService } from './meals.service';

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
}
