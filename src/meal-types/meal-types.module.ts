import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealType } from './entities/meal_types.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MealType])],
  providers: [],
  exports: [],
})
export class MealTypesModule {}
