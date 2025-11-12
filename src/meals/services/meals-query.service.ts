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
      .where('meal.hidden = :hidden', { hidden: false }) // <-- dodane
      .orderBy('meal.id', 'DESC')
      .take(limit);

    if (cursor) {
      query.andWhere('meal.id < :cursor', { cursor: parseInt(cursor, 10) });
    }

    const meals = await query.getMany();

    const transformedMeals = meals.map((meal) => ({
      id: meal.id,
      meal_id: meal.meal_id,
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

    const nextCursor = meals.length > 0 ? meals[meals.length - 1].id : null;

    return { data: transformedMeals, nextCursor };
  }
}
