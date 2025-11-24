import { Module } from '@nestjs/common';

import { MealsModule } from './meals/meals.module';
import { ImagesModule } from './images/images.module';
import { MealTypesModule } from './meal-types/meal-types.module';
import { SidebarTagsModule } from './sidebar-tags/sidebar-tags.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './database/data-source';
import { SidebarModule } from './sidebar/sidebar.module';
import { MealTagsModule } from './meal-tags/meal-tags.module';
import { ConfigModule } from '@nestjs/config';
import { MealStatusesModule } from './meal-statuses/meal-statuses.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { RecipesModule } from './recipes/recipes.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    MealTagsModule,
    MealsModule,
    ImagesModule,
    MealTypesModule,
    SidebarTagsModule,
    SidebarModule,
    MealStatusesModule,
    IngredientsModule,
    RecipesModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [],
})
export class AppModule {}
