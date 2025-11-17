// database/data-source.ts
import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import { MealType } from 'src/meal-types/entities/meal_types.entity';
import { Meal } from 'src/meals/entities/meal.entity';
import { Image } from 'src/images/entities/image.entity';
import { SidebarTag } from 'src/sidebar-tags/entities/sidebar_tag.entity';
import { MealTag } from 'src/meal-tags/entities/meal-tag.entity';

// ścieżka do pliku sqlite
const databasePath = join(__dirname, '..', '..', 'database', 'meals.db');

export const typeOrmConfig: DataSourceOptions = {
  type: 'sqlite',
  database: databasePath,
  entities: [MealType, Meal, Image, MealTag, SidebarTag],
  synchronize: true,
};

export const dataSource = new DataSource(typeOrmConfig);

// opcjonalnie seed MealTypes
export const initializeDatabase = async () => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  const mealTypeRepo = dataSource.getRepository(MealType);
  const count = await mealTypeRepo.count();
  if (count === 0) {
    const initialMealTypes = [
      { id: 1, name: 'Śniadanie' },
      { id: 2, name: 'Drugie śniadanie' },
      { id: 3, name: 'Obiad' },
      { id: 4, name: 'Podwieczorek' },
      { id: 5, name: 'Kolacja' },
      { id: 6, name: 'Przekąska' },
    ];
    await mealTypeRepo.save(initialMealTypes);
    console.log('Meal types seeded!');
  }
};
