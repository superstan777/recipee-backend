import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meal } from '../entities/meal.entity';

@Injectable()
export class MealsQueryService {
  constructor(
    @InjectRepository(Meal) private readonly mealsRepo: Repository<Meal>,
  ) {}

  async getMeals({
    mealTypeId,
    tagId,
    limit,
    cursor,
  }: {
    mealTypeId?: string;
    tagId?: string;
    limit: number;
    cursor?: string;
  }) {
    if (mealTypeId && tagId) {
      throw new BadRequestException(
        'Provide only mealTypeId OR tagId, not both.',
      );
    }

    if (!mealTypeId && !tagId) {
      throw new BadRequestException(
        'You must provide either mealTypeId or tagId.',
      );
    }

    if (mealTypeId) {
      const query = this.mealsRepo
        .createQueryBuilder('meal')
        .leftJoinAndSelect('meal.meal_type', 'meal_type')
        .leftJoinAndSelect('meal.images', 'images')
        .where('meal.meal_type_id = :mealTypeId', { mealTypeId })
        .andWhere('meal.hidden = false')
        .orderBy('meal.pagination_id', 'DESC')
        .take(limit);

      if (cursor) {
        query.andWhere('meal.pagination_id < :cursor', {
          cursor: parseInt(cursor, 10),
        });
      }

      const meals = await query.getMany();

      return {
        data: this.transform(meals),
        nextCursor:
          meals.length > 0 ? meals[meals.length - 1].pagination_id : null,
      };
    }

    if (tagId) {
      const query = this.mealsRepo
        .createQueryBuilder('meal')
        .leftJoinAndSelect('meal.meal_type', 'meal_type')
        .leftJoinAndSelect('meal.images', 'images')
        .leftJoin('meal.meal_tags', 'meal_tags')
        .where('meal_tags.tag_id = :tagId', { tagId })
        .andWhere('meal.hidden = false')
        .orderBy('meal.pagination_id', 'DESC')
        .take(limit);

      if (cursor) {
        query.andWhere('meal.pagination_id < :cursor', {
          cursor: parseInt(cursor, 10),
        });
      }

      const meals = await query.getMany();

      return {
        data: this.transform(meals),
        nextCursor:
          meals.length > 0 ? meals[meals.length - 1].pagination_id : null,
      };
    }
  }

  private transform(meals: Meal[]) {
    return meals.map((meal) => ({
      pagination_id: meal.pagination_id,
      id: meal.id,
      name: meal.name,
      meal_type: meal.meal_type?.name || null,
      hidden: meal.hidden,
      done: meal.done,
      rating: meal.rating,
      created_at: meal.created_at,
      image: meal.images?.[0]
        ? {
            url: meal.images[0].url,
            local_path: meal.images[0].local_path,
          }
        : null,
    }));
  }
}
