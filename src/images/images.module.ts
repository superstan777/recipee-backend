import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { ImagesService } from './images.service';
import { Meal } from '../meals/entities/meal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Image, Meal])],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
