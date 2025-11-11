import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomTag } from './entities/custom_tag.entity';
import { MealCustomTag } from './entities/meal_custom_tag.entity';
import { SidebarTag } from './entities/sidebar_tag.entity';
import { TagsService } from './tags.service';
import { Meal } from '../meals/entities/meal.entity';
import { MealType } from '../meal-type/entities/meal_type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CustomTag,
      MealCustomTag,
      SidebarTag,
      Meal,
      MealType,
    ]),
  ],
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule {}
