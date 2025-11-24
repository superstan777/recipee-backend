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

  @UseGuards(JwtAuthGuard)
  @Post('batch')
  async getStatusesForMeals(
    @Body() body: { meal_ids: number[] },
    @Req() req: Request,
  ) {
    const user = req.user as { id: number };
    return this.mealStatusesService.getStatusesForMeals(user.id, body.meal_ids);
  }

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

  @UseGuards(JwtAuthGuard)
  @Patch('hide')
  async hideMeal(@Body() body: { meal_id: number }, @Req() req: Request) {
    const user = req.user as { id: number };
    return this.mealStatusesService.hideMeal(user.id, body.meal_id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':meal_id/seen')
  async markAsSeen(@Param('meal_id') meal_id: number, @Req() req: Request) {
    const user = req.user as { id: number };
    return this.mealStatusesService.markAsSeen(user.id, Number(meal_id));
  }
}
