import { Body, Controller, Post } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { Recipe } from './entities/recipe.entity';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post('get-recipe')
  async getRecipe(@Body('meal_id') meal_id: number): Promise<Recipe> {
    if (!meal_id) throw new Error('meal_id is required');
    return this.recipesService.getOrGenerateRecipe(meal_id);
  }
}
