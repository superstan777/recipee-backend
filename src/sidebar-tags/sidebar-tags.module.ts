import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SidebarTag } from './entities/sidebar_tag.entity';
import { SidebarTagsService } from './sidebar-tags.service';
import { MealType } from '../meal-types/entities/meal_types.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SidebarTag, MealType])],
  providers: [SidebarTagsService],
  exports: [SidebarTagsService],
})
export class SidebarTagsModule {}
