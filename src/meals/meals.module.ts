import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { MealsService } from './meals.service';
import { MealsFetchService } from './services/meals-fetch.service';
import { MealsStorageService } from './services/meals-storage.service';
import { MealsQueryService } from './services/meals-query.service';
import { MealsController } from './meals.controller';
import { MealsCronService } from './meals-cron.service';
import { Meal } from './entities/meal.entity';
import { Image } from '../images/entities/image.entity';
import { MealType } from '../meal-types/entities/meal_types.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Meal, Image, MealType]),
    ScheduleModule.forRoot(),
  ],
  providers: [
    MealsService,
    MealsFetchService,
    MealsStorageService,
    MealsQueryService,
    MealsCronService,
  ],
  controllers: [MealsController],
  exports: [MealsService],
})
export class MealsModule {}
