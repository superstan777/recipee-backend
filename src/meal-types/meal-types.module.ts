import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealType } from './entities/meal_types.entity';
import { MealTypesService } from './meal-types.service';

@Module({
  imports: [TypeOrmModule.forFeature([MealType])],
  providers: [MealTypesService],
  exports: [MealTypesService],
})
export class MealTypesModule {}
