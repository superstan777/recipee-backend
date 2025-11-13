import { DataSource } from 'typeorm';
import { join } from 'path';
import { MealType } from 'src/meal-types/entities/meal_types.entity';
import { Meal } from 'src/meals/entities/meal.entity';
import { Image } from 'src/images/entities/image.entity';
import { SidebarTag } from 'src/sidebar-tags/entities/sidebar_tag.entity';
import { MealSidebarTag } from 'src/meal-sidebar-tags/entities/meal_sidebar_tag.entity';

const databasePath = join(__dirname, '..', '..', 'database', 'meals.db');

export const dataSource = new DataSource({
  type: 'sqlite',
  database: databasePath,
  entities: [MealType, Meal, Image, MealSidebarTag, SidebarTag],
  synchronize: true,
});
