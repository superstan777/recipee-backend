import { Controller, Post, Body } from '@nestjs/common';
import { MealsQueryService } from './services/meals-query.service';
import { MealsService } from './meals.service';

interface GetMealsDto {
  mealTypeId?: string;
  tagId?: string;
  limit?: number;
  cursor?: string;
  userId: number;
}

@Controller('meals')
export class MealsController {
  constructor(
    private mealsQueryService: MealsQueryService,
    private mealsService: MealsService,
  ) {}

  @Post('meals')
  getMeals(@Body() body: GetMealsDto) {
    const { mealTypeId, tagId, limit = 30, cursor, userId } = body;

    if (!userId) {
      throw new Error('userId is required');
    }

    return this.mealsQueryService.getMeals({
      mealTypeId,
      tagId,
      cursor,
      limit,
      userId,
    });
  }
}
