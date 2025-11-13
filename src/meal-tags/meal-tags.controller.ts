import { Body, Controller, Post, Delete, Param, Get } from '@nestjs/common';
import { MealTagsService } from './meal-tags.service';

interface AddMealTagDto {
  meal_id: number;
  tag_id: number;
}

@Controller('meal-tags')
export class MealTagsController {
  constructor(private readonly mealTagsService: MealTagsService) {}

  @Post()
  async addTagToMeal(@Body() dto: AddMealTagDto) {
    const result = await this.mealTagsService.addTagToMeal(
      dto.meal_id,
      dto.tag_id,
    );
    return { success: true, data: result };
  }

  @Delete()
  async removeTagFromMeal(@Body() dto: AddMealTagDto) {
    const result = await this.mealTagsService.removeTagFromMeal(
      dto.meal_id,
      dto.tag_id,
    );
    return { success: true };
  }

  @Get(':mealId')
  async getTagsForMeal(@Param('mealId') mealId: number) {
    return this.mealTagsService.getTagsForMeal(mealId);
  }

  @Get('by-tag/:tagId')
  async getMealsByTag(@Param('tagId') tagId: number) {
    return this.mealTagsService.getMealsByTag(tagId);
  }
}
