import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron.service';
import { MealsModule } from '../meals/meals.module';
import { ImagesModule } from '../images/images.module';
import { TagsModule } from '../tags/tags.module';

@Module({
  imports: [ScheduleModule.forRoot(), MealsModule, ImagesModule, TagsModule],
  providers: [CronService],
})
export class CronModule {}
