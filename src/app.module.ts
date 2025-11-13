import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MealsModule } from './meals/meals.module';
import { ImagesModule } from './images/images.module';
import { MealTypesModule } from './meal-types/meal-types.module';
import { SidebarTagsModule } from './sidebar-tags/sidebar-tags.module';
import { CronModule } from './cron/cron.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/database.config';

import { SidebarModule } from './sidebar/sidebar.module';

import { MealTagsModule } from './meal-tags/meal-tags.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    MealTagsModule,
    MealsModule,
    ImagesModule,
    MealTypesModule,
    SidebarTagsModule,
    CronModule,
    SidebarModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
