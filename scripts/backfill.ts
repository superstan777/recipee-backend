import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { MealsService } from 'src/meals/meals.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const mealsService = app.get(MealsService);

  // TU PODAJESZ ZAKRES
  const start = new Date('2024-11-01');
  const end = new Date('2024-11-28');

  // iteracja po dniach
  for (
    let date = new Date(start);
    date <= end;
    date.setDate(date.getDate() + 1)
  ) {
    const iso = date.toISOString().split('T')[0];
    console.log(`Backfilling: ${iso}`);

    try {
      // przekazujemy bezpośrednio obiekt Date
      await mealsService.fetchAndStoreMeals(date);
      console.log(`✔ Saved meals for ${iso}`);
    } catch (err) {
      console.error(`Error saving meals for ${iso}:`, err);
    }

    // Opcjonalny delay, aby nie spamować API
    await new Promise((res) => setTimeout(res, 1000));
  }

  await app.close();
}

bootstrap();
