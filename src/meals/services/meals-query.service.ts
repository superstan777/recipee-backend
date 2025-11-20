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
    userId,
  }: {
    mealTypeId?: string;
    tagId?: string;
    limit: number;
    cursor?: string;
    userId: number;
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

    const query = this.mealsRepo
      .createQueryBuilder('meal')
      .leftJoinAndSelect('meal.meal_type', 'meal_type')
      .leftJoinAndSelect('meal.images', 'images')
      .leftJoin(
        'meal_statuses',
        'status',
        'status.meal_id = meal.id AND status.user_id = :userId',
        { userId },
      )
      .orderBy('meal.pagination_id', 'DESC')
      .take(limit);

    if (cursor) {
      query.andWhere('meal.pagination_id < :cursor', {
        cursor: parseInt(cursor, 10),
      });
    }

    if (mealTypeId) {
      query.andWhere('meal.meal_type_id = :mealTypeId', { mealTypeId });
    } else if (tagId) {
      query
        .leftJoin('meal.meal_tags', 'meal_tags')
        .andWhere('meal_tags.tag_id = :tagId', { tagId });
    }

    // Filtrujemy po hidden, ale przepuszczamy te, które nie mają statusu
    query.andWhere('(status.hidden IS NULL OR status.hidden = false)');

    const meals = await query.getMany();

    return {
      data: this.transform(meals),
      nextCursor:
        meals.length > 0 ? meals[meals.length - 1].pagination_id : null,
    };
  }

  private transform(meals: Meal[]) {
    return meals.map((meal) => ({
      pagination_id: meal.pagination_id,
      id: meal.id,
      name: meal.name,
      meal_type: meal.meal_type?.name || null,
      image: meal.images?.[0]
        ? {
            url: meal.images[0].url,
            local_path: meal.images[0].local_path,
          }
        : null,
    }));
  }
}
