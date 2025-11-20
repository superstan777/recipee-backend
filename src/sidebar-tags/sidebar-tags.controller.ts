import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SidebarTagsService } from './sidebar-tags.service';

@Controller('sidebar-tags')
export class SidebarTagsController {
  constructor(private readonly sidebarTagsService: SidebarTagsService) {}

  @Get(':user_id')
  async getAll(@Param('user_id') user_id: number) {
    return this.sidebarTagsService.findAll(user_id);
  }

  @Get('meal-type/:meal_type_id/:user_id')
  async getByMealType(
    @Param('meal_type_id') meal_type_id: number,
    @Param('user_id') user_id: number,
  ) {
    return this.sidebarTagsService.findByMealType(meal_type_id, user_id);
  }

  @Post()
  async create(
    @Body() body: { meal_type_id: number; tag_name: string; user_id: number },
  ) {
    const { meal_type_id, tag_name, user_id } = body;
    return this.sidebarTagsService.create(meal_type_id, tag_name, user_id);
  }
}
