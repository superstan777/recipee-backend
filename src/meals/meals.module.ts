import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MealsService } from './meals.service';
import { MealsController } from './meals.controller';

@Module({
  imports: [HttpModule],
  providers: [MealsService],
  controllers: [MealsController],
})
export class MealsModule {}
