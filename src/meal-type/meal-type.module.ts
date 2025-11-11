import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealType } from './entities/meal_type.entity';
import { MealTypeService } from './meal-type.service';

@Module({
  imports: [TypeOrmModule.forFeature([MealType])],
  providers: [MealTypeService],
  exports: [MealTypeService],
})
export class MealTypeModule {}
