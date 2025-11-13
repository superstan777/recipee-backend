import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealTagsService } from './meal-tags.service';
import { MealTagsController } from './meal-tags.controller';
import { MealTag } from './entities/meal-tag.entity';
import { Meal } from '../meals/entities/meal.entity';
import { SidebarTag } from '../sidebar-tags/entities/sidebar_tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MealTag, Meal, SidebarTag])],
  providers: [MealTagsService],
  controllers: [MealTagsController],
  exports: [MealTagsService],
})
export class MealTagsModule {}
