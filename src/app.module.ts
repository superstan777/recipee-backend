import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MealsModule } from './meals/meals.module';
import { ImagesModule } from './images/images.module';
import { TagsModule } from './tags/tags.module';
import { MealTypeModule } from './meal-type/meal-type.module';
import { CronModule } from './cron/cron.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    MealsModule,
    ImagesModule,
    TagsModule,
    MealTypeModule,
    CronModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
