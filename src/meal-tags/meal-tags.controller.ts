import { Body, Controller, Post, Delete } from '@nestjs/common';
import { MealTagsService } from './meal-tags.service';

interface AddMealTagDto {
  meal_id: number;
  tag_id: number;
  user_id: number;
}

@Controller('meal-tags')
export class MealTagsController {
  constructor(private readonly mealTagsService: MealTagsService) {}

  @Post()
  async addTagToMeal(@Body() dto: AddMealTagDto) {
    // zwracamy samą relację MealTag
    return this.mealTagsService.addTagToMeal(
      dto.user_id,
      dto.meal_id,
      dto.tag_id,
    );
  }

  @Delete()
  async removeTagFromMeal(@Body() dto: AddMealTagDto) {
    await this.mealTagsService.removeTagFromMeal(
      dto.user_id,
      dto.meal_id,
      dto.tag_id,
    );

    return true; // prosta odpowiedź
  }

  @Post('tags-for-meal')
  async getTagsForMeal(@Body() body: { user_id: number; meal_id: number }) {
    const relations = await this.mealTagsService.getTagsForMeal(
      body.user_id,
      body.meal_id,
    );

    // frontend potrzebuje listy tagów → wyciągamy sam `tag`
    return relations.map((rel) => rel.tag);
  }

  @Post('meals-by-tag')
  async getMealsByTag(@Body() body: { user_id: number; tag_id: number }) {
    const relations = await this.mealTagsService.getMealsByTag(
      body.user_id,
      body.tag_id,
    );

    // zwracamy tylko posiłki
    return relations.map((rel) => rel.meal);
  }
}
