import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SidebarService } from './sidebar.service';
import { SidebarController } from './sidebar.controller';
import { MealType } from '../meal-types/entities/meal_types.entity';
import { SidebarTag } from 'src/sidebar-tags/entities/sidebar_tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MealType, SidebarTag])],
  providers: [SidebarService],
  controllers: [SidebarController],
  exports: [SidebarService],
})
export class SidebarModule {}
