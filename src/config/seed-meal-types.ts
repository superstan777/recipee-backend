import { dataSource } from '../database/data-source';
import { MealType } from 'src/meal-types/entities/meal_types.entity';

export async function seedMealTypes() {
  await dataSource.initialize();
  const repo = dataSource.getRepository(MealType);

  const initialMealTypes = [
    {
      id: 2,
      name: 'Drugie \u015bniadanie',
    },
    {
      id: 4,
      name: 'Podwieczorek',
    },
    {
      id: 6,
      name: 'Przek\u0105ska',
    },
    {
      id: 1,
      name: '\u015aniadanie',
    },
    {
      id: 3,
      name: 'Obiad',
    },
    {
      id: 5,
      name: 'Kolacja',
    },
  ];

  for (const type of initialMealTypes) {
    const exists = await repo.findOne({ where: { id: type.id } });
    if (!exists) {
      await repo.save(repo.create(type));
    }
  }

  await dataSource.destroy();
  console.log('Meal types seeded!');
}

// Uruchamianie z terminala
if (require.main === module) {
  seedMealTypes()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
