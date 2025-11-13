import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SidebarTag } from './entities/sidebar_tag.entity';
import { MealType } from '../meal-types/entities/meal_types.entity';
import { SidebarTagsService } from './sidebar-tags.service';
import { SidebarTagsController } from './sidebar-tags.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SidebarTag, MealType])],
  providers: [SidebarTagsService],
  controllers: [SidebarTagsController],
  exports: [SidebarTagsService],
})
export class SidebarTagsModule {}
