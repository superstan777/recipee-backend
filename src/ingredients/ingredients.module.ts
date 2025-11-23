import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientsService } from './ingredients.service';
import { Ingredients } from './entities/ingredients.entity';
import { Meal } from '../meals/entities/meal.entity';

@Module({
  imports: [
    HttpModule, // do requestów HTTP
    TypeOrmModule.forFeature([Ingredients, Meal]), // repozytoria
  ],
  providers: [IngredientsService],
  exports: [IngredientsService], // jeśli chcemy używać w innych serwisach
})
export class IngredientsModule {}
