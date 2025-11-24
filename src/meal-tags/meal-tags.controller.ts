import { Body, Controller, Post, Delete, UseGuards, Req } from '@nestjs/common';
import { MealTagsService } from './meal-tags.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import type { Request } from 'express';

interface AddMealTagDto {
  meal_id: number;
  tag_id: number;
}

interface MealDto {
  meal_id: number;
}

interface TagDto {
  tag_id: number;
}

@UseGuards(JwtAuthGuard)
@Controller('meal-tags')
export class MealTagsController {
  constructor(private readonly mealTagsService: MealTagsService) {}

  @Post()
  async addTagToMeal(@Body() dto: AddMealTagDto, @Req() req: Request) {
    const user = req.user as { id: number };
    return this.mealTagsService.addTagToMeal(user.id, dto.meal_id, dto.tag_id);
  }

  @Delete()
  async removeTagFromMeal(@Body() dto: AddMealTagDto, @Req() req: Request) {
    const user = req.user as { id: number };
    await this.mealTagsService.removeTagFromMeal(
      user.id,
      dto.meal_id,
      dto.tag_id,
    );
    return true;
  }

  @Post('tags-for-meal')
  async getTagsForMeal(@Body() body: MealDto, @Req() req: Request) {
    const user = req.user as { id: number };
    const relations = await this.mealTagsService.getTagsForMeal(
      user.id,
      body.meal_id,
    );
    return relations.map((rel) => rel.tag);
  }

  @Post('meals-by-tag')
  async getMealsByTag(@Body() body: TagDto, @Req() req: Request) {
    const user = req.user as { id: number };
    const relations = await this.mealTagsService.getMealsByTag(
      user.id,
      body.tag_id,
    );
    return relations.map((rel) => rel.meal);
  }
}
