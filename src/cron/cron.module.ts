import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron.service';
import { MealsModule } from '../meals/meals.module';
import { ImagesModule } from '../images/images.module';
import { SidebarTagsModule } from '../sidebar-tags/sidebar-tags.module';
import { MealSidebarTagsModule } from '../meal-sidebar-tags/meal-sidebar-tags.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MealsModule,
    ImagesModule,
    SidebarTagsModule,
    MealSidebarTagsModule,
  ],
  providers: [CronService],
})
export class CronModule {}
