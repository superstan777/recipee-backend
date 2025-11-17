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

    const baseQuery = this.mealsRepo
      .createQueryBuilder('meal')
      .leftJoinAndSelect('meal.meal_type', 'meal_type')
      .leftJoinAndSelect('meal.images', 'images')
      // JOIN DO TAGÓW PRZYPISANYCH
      .leftJoin('meal.meal_tags', 'meal_tags')
      // JOIN DO DEFINICJI TAGÓW (sidebar_tags)
      .leftJoin('sidebar_tags', 'tags', 'tags.id = meal_tags.tag_id')
      .where('meal.hidden = false')
      .select([
        'meal',
        'meal_type',
        'images',
        // potrzebne do joinów
        'tags.id',
        'tags.tag_name',
        'tags.meal_type_id',
      ])
      .orderBy('meal.pagination_id', 'DESC')
      .take(limit);

    if (mealTypeId) {
      baseQuery.andWhere('meal.meal_type_id = :mealTypeId', { mealTypeId });
    }

    if (tagId) {
      baseQuery.andWhere('meal_tags.tag_id = :tagId', { tagId });
    }

    if (cursor) {
      baseQuery.andWhere('meal.pagination_id < :cursor', {
        cursor: parseInt(cursor, 10),
      });
    }

    const meals = await baseQuery.getRawAndEntities();

    return {
      data: this.transform(meals.entities, meals.raw),
      nextCursor:
        meals.entities.length > 0
          ? meals.entities[meals.entities.length - 1].pagination_id
          : null,
    };
  }

  // Transformuje dane + łączy tagi
  private transform(meals: Meal[], raw: any[]) {
    return meals.map((meal) => {
      const mealRawRows = raw.filter((row) => row.meal_id === meal.id);

      const tags = mealRawRows
        .filter((r) => r.tags_id !== null)
        .map((r) => ({
          id: r.tags_id,
          tag_name: r.tags_tag_name,
          meal_type_id: r.tags_meal_type_id,
        }));

      return {
        pagination_id: meal.pagination_id,
        id: meal.id,
        name: meal.name,
        meal_type: meal.meal_type?.name || null,
        hidden: meal.hidden,
        rating: meal.rating,
        new: meal.new,
        created_at: meal.created_at,
        // pierwszy obrazek
        image: meal.images?.[0]
          ? {
              url: meal.images[0].url,
              local_path: meal.images[0].local_path,
            }
          : null,
        // tylko tags
        tags,
      };
    });
  }
}
