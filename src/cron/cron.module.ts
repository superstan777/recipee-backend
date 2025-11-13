import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron.service';
import { MealsModule } from '../meals/meals.module';
import { ImagesModule } from '../images/images.module';
import { SidebarTagsModule } from '../sidebar-tags/sidebar-tags.module';
import { MealTagsModule } from 'src/meal-tags/meal-tags.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MealsModule,
    ImagesModule,
    SidebarTagsModule,
    MealTagsModule,
  ],
  providers: [CronService],
})
export class CronModule {}
