import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { MealStatus } from './entities/meal-status.entity';
import { Meal } from 'src/meals/entities/meal.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MealStatusesService {
  constructor(
    @InjectRepository(MealStatus)
    private readonly statusRepo: Repository<MealStatus>,

    @InjectRepository(Meal)
    private readonly mealsRepo: Repository<Meal>,

    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  private async getOrCreateStatus(
    user_id: number,
    meal_id: number,
  ): Promise<MealStatus> {
    let status = await this.statusRepo.findOne({
      where: { user: { id: user_id }, meal: { id: meal_id } },
      relations: ['user', 'meal'],
    });

    if (!status) {
      const user = await this.usersRepo.findOne({ where: { id: user_id } });
      const meal = await this.mealsRepo.findOne({ where: { id: meal_id } });

      if (!user) throw new Error(`User ${user_id} not found`);
      if (!meal) throw new Error(`Meal ${meal_id} not found`);

      status = this.statusRepo.create({
        user,
        meal,
        rating: null,
        new: true,
        hidden: false,
      });

      await this.statusRepo.save(status);
    }

    return status;
  }

  async rateMeal(
    user_id: number,
    meal_id: number,
    rating: number | null,
  ): Promise<{
    meal_id: number;
    hidden: boolean;
    new: boolean;
    rating: number | null;
  }> {
    if (rating !== null && (rating < 1 || rating > 5))
      throw new Error('Rating must be between 1 and 5');

    const status = await this.getOrCreateStatus(user_id, meal_id);
    status.rating = rating;

    const saved = await this.statusRepo.save(status);

    return {
      meal_id: saved.meal.id,
      hidden: saved.hidden,
      new: saved.new,
      rating: saved.rating,
    };
  }

  async hideMeal(user_id: number, meal_id: number) {
    const status = await this.statusRepo.findOne({
      where: { user: { id: user_id }, meal: { id: meal_id } },
      relations: ['meal'],
    });

    if (!status) {
      throw new Error(
        `MealStatus not found for user ${user_id} and meal ${meal_id}. This should never happen.`,
      );
    }

    status.hidden = true;

    const saved = await this.statusRepo.save(status);

    return {
      meal_id: saved.meal.id,
      hidden: saved.hidden,
      new: saved.new,
      rating: saved.rating,
    };
  }

  async markAsSeen(user_id: number, meal_id: number) {
    const status = await this.getOrCreateStatus(user_id, meal_id);

    status.new = false;

    const saved = await this.statusRepo.save(status);

    return {
      meal_id: saved.meal.id,
      hidden: saved.hidden,
      new: saved.new,
      rating: saved.rating,
    };
  }

  async getStatusesForMeals(user_id: number, meal_ids: number[]) {
    if (!meal_ids || meal_ids.length === 0) return [];

    const existing = await this.statusRepo.find({
      where: {
        user: { id: user_id },
        meal: { id: In(meal_ids) },
      },
      relations: ['meal'],
    });

    const existingMealIds = new Set(existing.map((s) => s.meal.id));
    const missingIds = meal_ids.filter((id) => !existingMealIds.has(id));

    let created: MealStatus[] = [];

    if (missingIds.length > 0) {
      const user = await this.usersRepo.findOne({ where: { id: user_id } });
      if (!user) throw new Error(`User ${user_id} not found`);

      const missingMeals = await this.mealsRepo.find({
        where: { id: In(missingIds) },
      });

      const toCreate = missingMeals.map((meal) =>
        this.statusRepo.create({
          user,
          meal,
          hidden: false,
          new: true,
          rating: null,
        }),
      );

      created = await this.statusRepo.save(toCreate);
    }

    const all = [...existing, ...created];

    return all.map((s) => ({
      meal_id: s.meal.id,
      rating: s.rating,
      new: s.new,
      hidden: s.hidden,
    }));
  }
}
