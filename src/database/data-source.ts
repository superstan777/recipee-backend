import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import { MealType } from 'src/meal-types/entities/meal_types.entity';
import { Meal } from 'src/meals/entities/meal.entity';
import { Image } from 'src/images/entities/image.entity';
import { SidebarTag } from 'src/sidebar-tags/entities/sidebar_tag.entity';
import { MealTag } from 'src/meal-tags/entities/meal-tag.entity';
import { User } from 'src/users/entities/user.entity';
import { MealStatus } from 'src/meal-statuses/entities/meal-status.entity';
import * as bcrypt from 'bcrypt';
import { Ingredients } from 'src/ingredients/entities/ingredients.entity';

const databasePath = join(__dirname, '..', '..', 'database', 'meals.db');

export const typeOrmConfig: DataSourceOptions = {
  type: 'sqlite',
  database: databasePath,
  entities: [
    MealType,
    Meal,
    Image,
    MealTag,
    SidebarTag,
    User,
    MealStatus,
    Ingredients,
  ],
  synchronize: true,
};

export const dataSource = new DataSource(typeOrmConfig);

export const initializeDatabase = async () => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  const mealTypeRepo = dataSource.getRepository(MealType);
  const mealTypeCount = await mealTypeRepo.count();
  if (mealTypeCount === 0) {
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

  const userRepo = dataSource.getRepository(User);
  const adminExists = await userRepo.findOne({ where: { role: 'admin' } });

  if (!adminExists) {
    const password = 'admin123';
    const passwordHash = await bcrypt.hash(password, 10);

    const adminUser = userRepo.create({
      email: 'admin@example.com',
      passwordHash,
      role: 'admin',
    });

    await userRepo.save(adminUser);
    console.log(
      'Admin user created! Email: admin@example.com, Password: admin123',
    );
  }
};
