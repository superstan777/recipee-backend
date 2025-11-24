import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { SidebarTagsService } from './sidebar-tags.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import type { Request } from 'express';

@Controller('sidebar-tags')
export class SidebarTagsController {
  constructor(private readonly sidebarTagsService: SidebarTagsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('meal-type')
  async getByMealType(
    @Body('meal_type_id') meal_type_id: number,
    @Req() req: Request,
  ) {
    const user = req.user as { id: number };
    return this.sidebarTagsService.findByMealType(meal_type_id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTag(
    @Body() body: { meal_type_id: number; tag_name: string },
    @Req() req: Request,
  ) {
    const user = req.user as { id: number };
    const { meal_type_id, tag_name } = body;
    return this.sidebarTagsService.createTag(user.id, meal_type_id, tag_name);
  }
}
