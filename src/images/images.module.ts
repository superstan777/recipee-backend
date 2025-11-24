import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { ImagesService } from './images.service';
import { Meal } from '../meals/entities/meal.entity';
import { ImagesController } from './images.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Image, Meal])],
  providers: [ImagesService],
  controllers: [ImagesController],
})
export class ImagesModule {}
