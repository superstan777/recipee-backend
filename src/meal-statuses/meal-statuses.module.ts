import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealStatus } from './entities/meal-status.entity';
import { MealStatusesService } from './meal-statuses.service';
import { Meal } from 'src/meals/entities/meal.entity';
import { User } from 'src/users/entities/user.entity';
import { MealStatusesController } from './meal-statuses.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MealStatus, Meal, User])],
  controllers: [MealStatusesController],
  providers: [MealStatusesService],
  exports: [MealStatusesService],
})
export class MealStatusesModule {}
