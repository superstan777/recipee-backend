import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { MealsQueryService } from './services/meals-query.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import type { Request } from 'express';

interface GetMealsDto {
  mealTypeId?: string;
  tagId?: string;
  limit?: number;
  cursor?: string;
}

@Controller('meals')
export class MealsController {
  constructor(private mealsQueryService: MealsQueryService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  getMeals(@Body() body: GetMealsDto, @Req() req: Request) {
    const user = req.user as { id: number };

    return this.mealsQueryService.getMeals({
      mealTypeId: body.mealTypeId,
      tagId: body.tagId,
      cursor: body.cursor,
      limit: body.limit ?? 30,
      userId: user.id, // <-- pobrane z JWT
    });
  }
}
