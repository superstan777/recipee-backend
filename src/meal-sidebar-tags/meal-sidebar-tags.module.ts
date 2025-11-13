import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealSidebarTag } from './entities/meal_sidebar_tag.entity';
import { MealSidebarTagsService } from './meal-sidebar-tags.service';
import { Meal } from '../meals/entities/meal.entity';
import { SidebarTag } from '../sidebar-tags/entities/sidebar_tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MealSidebarTag, Meal, SidebarTag])],
  providers: [MealSidebarTagsService],
  exports: [MealSidebarTagsService],
})
export class MealSidebarTagsModule {}
