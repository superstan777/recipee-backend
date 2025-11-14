import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meal } from '../entities/meal.entity';

@Injectable()
export class MealsQueryService {
  constructor(
    @InjectRepository(Meal) private readonly mealsRepo: Repository<Meal>,
  ) {}

  async getMealsCursor({ cursor, limit }: { cursor?: string; limit: number }) {
    const query = this.mealsRepo
      .createQueryBuilder('meal')
      .leftJoinAndSelect('meal.meal_type', 'meal_type')
      .leftJoinAndSelect('meal.images', 'images')
      .where('meal.hidden = :hidden', { hidden: false })
      .orderBy('meal.pagination_id', 'DESC') // 🔹 zmienione na pagination_id
      .take(limit);

    if (cursor) {
      query.andWhere('meal.pagination_id < :cursor', {
        cursor: parseInt(cursor, 10),
      }); // 🔹 pagination_id
    }

    const meals = await query.getMany();

    const transformedMeals = meals.map((meal) => ({
      id: meal.id, // faktyczne ID posiłku
      meal_id: meal.id, // jeśli frontend nadal oczekuje meal_id, ustawiamy to samo co id
      name: meal.name,
      meal_type: meal.meal_type?.name || null,
      hidden: meal.hidden,
      done: meal.done,
      rating: meal.rating,
      created_at: meal.created_at,
      image:
        meal.images && meal.images.length > 0
          ? {
              url: meal.images[0].url,
              local_path: meal.images[0].local_path,
            }
          : null,
    }));

    const nextCursor =
      meals.length > 0 ? meals[meals.length - 1].pagination_id : null;

    return { data: transformedMeals, nextCursor };
  }
}
