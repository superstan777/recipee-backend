import { Controller, Post, Body } from '@nestjs/common';
import { SidebarTagsService } from './sidebar-tags.service';

@Controller('sidebar-tags')
export class SidebarTagsController {
  constructor(private readonly sidebarTagsService: SidebarTagsService) {}

  @Post('meal-type')
  async getByMealType(
    @Body('meal_type_id') meal_type_id: number,
    @Body('user_id') user_id: number,
  ) {
    return this.sidebarTagsService.findByMealType(meal_type_id, user_id);
  }

  @Post()
  async createTag(
    @Body() body: { user_id: number; meal_type_id: number; tag_name: string },
  ) {
    const { user_id, meal_type_id, tag_name } = body;
    return this.sidebarTagsService.createTag(user_id, meal_type_id, tag_name);
  }
}
