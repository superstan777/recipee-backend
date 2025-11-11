import { DataSource } from 'typeorm';
import { join } from 'path';
import { MealType } from 'src/meal-type/entities/meal_type.entity';
import { Meal } from 'src/meals/entities/meal.entity';
import { Image } from 'src/images/entities/image.entity';
import { MealCustomTag } from 'src/tags/entities/meal_custom_tag.entity';
import { CustomTag } from 'src/tags/entities/custom_tag.entity';
import { SidebarTag } from 'src/tags/entities/sidebar_tag.entity';

const databasePath = join(__dirname, '..', '..', 'database', 'meals.db');

export const dataSource = new DataSource({
  type: 'sqlite',
  database: databasePath,
  entities: [MealType, Meal, Image, MealCustomTag, CustomTag, SidebarTag],
  synchronize: true,
});
