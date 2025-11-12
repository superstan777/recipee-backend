import { Controller, Get, Query } from '@nestjs/common';
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
}
