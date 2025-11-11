import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MealsService } from './meals.service';
import { MealsController } from './meals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meal } from './entities/meal.entity';
import { Image } from '../images/entities/image.entity';
import { MealType } from '../meal-type/entities/meal_type.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Meal, Image, MealType]),
    ScheduleModule.forRoot(),
  ],
  providers: [MealsService],
  controllers: [MealsController],
  exports: [MealsService],
})
export class MealsModule {}
