import {
  Controller,
  Patch,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MealStatusesService } from './meal-statuses.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import type { Request } from 'express';

@Controller('meal-statuses')
export class MealStatusesController {
  constructor(private readonly mealStatusesService: MealStatusesService) {}

  // -----------------------------------
  // POST statuses for many meals
  // /meal-statuses/batch
  // body: { meal_ids: number[] }
  // -----------------------------------
  @UseGuards(JwtAuthGuard)
  @Post('batch')
  async getStatusesForMeals(
    @Body() body: { meal_ids: number[] },
    @Req() req: Request,
  ) {
    const user = req.user as { id: number };

    return this.mealStatusesService.getStatusesForMeals(user.id, body.meal_ids);
  }

  // -----------------------------------
  // PATCH rate meal
  // /meal-statuses/rate
  // body: { meal_id: number, rating: number | null }
  // -----------------------------------
  @UseGuards(JwtAuthGuard)
  @Patch('rate')
  async rateMeal(
    @Body() body: { meal_id: number; rating: number | null },
    @Req() req: Request,
  ) {
    const user = req.user as { id: number };

    return this.mealStatusesService.rateMeal(
      user.id,
      body.meal_id,
      body.rating,
    );
  }

  // -----------------------------------
  // PATCH hide meal
  // /meal-statuses/hide
  // body: { meal_id: number }
  // -----------------------------------
  @UseGuards(JwtAuthGuard)
  @Patch('hide')
  async hideMeal(@Body() body: { meal_id: number }, @Req() req: Request) {
    const user = req.user as { id: number };

    return this.mealStatusesService.hideMeal(user.id, body.meal_id);
  }

  // -----------------------------------
  // PATCH mark as seen
  // /meal-statuses/:meal_id/seen
  // -----------------------------------
  @UseGuards(JwtAuthGuard)
  @Patch(':meal_id/seen')
  async markAsSeen(@Param('meal_id') meal_id: number, @Req() req: Request) {
    const user = req.user as { id: number };

    return this.mealStatusesService.markAsSeen(user.id, Number(meal_id));
  }
}
