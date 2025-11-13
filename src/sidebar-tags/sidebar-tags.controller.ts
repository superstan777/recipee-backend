import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SidebarTagsService } from './sidebar-tags.service';

@Controller('sidebar-tags')
export class SidebarTagsController {
  constructor(private readonly sidebarTagsService: SidebarTagsService) {}

  // Pobierz wszystkie tagi
  @Get()
  async getAll() {
    return this.sidebarTagsService.findAll();
  }

  // Pobierz tagi dla konkretnego meal_type
  @Get('meal-type/:meal_type_id')
  async getByMealType(@Param('meal_type_id') meal_type_id: number) {
    return this.sidebarTagsService.findByMealType(meal_type_id);
  }

  // Dodaj nowy sidebar tag
  @Post()
  async create(@Body() body: { meal_type_id: number; tag_name: string }) {
    const { meal_type_id, tag_name } = body;
    return this.sidebarTagsService.create(meal_type_id, tag_name);
  }
}
