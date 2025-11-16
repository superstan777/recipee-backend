import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { dataSource } from '../database/data-source';
import { MealType } from './entities/meal_types.entity';

@Injectable()
export class MealTypesService implements OnApplicationBootstrap {
  async onApplicationBootstrap() {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    await this.seedMealTypes();
  }

  private async seedMealTypes() {
    const repo = dataSource.getRepository(MealType);

    // jeśli tabela ma już rekordy, seed nie jest potrzebny
    const count = await repo.count();
    if (count > 0) return;

    const initialMealTypes = [
      { id: 2, name: 'Drugie śniadanie' },
      { id: 4, name: 'Podwieczorek' },
      { id: 6, name: 'Przekąska' },
      { id: 1, name: 'Śniadanie' },
      { id: 3, name: 'Obiad' },
      { id: 5, name: 'Kolacja' },
    ];

    for (const type of initialMealTypes) {
      await repo.save(repo.create(type));
    }

    console.log('Meal types seeded!');
  }
}
