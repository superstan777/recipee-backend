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
    userId: number,
    mealId: number,
  ): Promise<MealStatus> {
    let status = await this.statusRepo.findOne({
      where: { user: { id: userId }, meal: { id: mealId } },
      relations: ['user', 'meal'],
    });

    if (!status) {
      const user = await this.usersRepo.findOne({ where: { id: userId } });
      const meal = await this.mealsRepo.findOne({ where: { id: mealId } });

      if (!user) throw new Error(`User ${userId} not found`);
      if (!meal) throw new Error(`Meal ${mealId} not found`);

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
    userId: number,
    mealId: number,
    rating: number | null,
  ): Promise<MealStatus> {
    if (rating !== null && (rating < 1 || rating > 5))
      throw new Error('Rating must be between 1 and 5');

    const status = await this.getOrCreateStatus(userId, mealId);
    status.rating = rating;

    return this.statusRepo.save(status);
  }

  async hideMeal(userId: number, mealId: number): Promise<MealStatus> {
    const status = await this.getOrCreateStatus(userId, mealId);
    status.hidden = true;
    return this.statusRepo.save(status);
  }

  async markAsSeen(userId: number, mealId: number): Promise<MealStatus> {
    const status = await this.getOrCreateStatus(userId, mealId);
    status.new = false;
    return this.statusRepo.save(status);
  }

  async getStatusesForMeals(
    userId: number,
    mealIds: number[],
  ): Promise<MealStatus[]> {
    return this.statusRepo.find({
      where: {
        user: { id: userId },
        meal: { id: mealIds.length > 0 ? In(mealIds) : undefined },
      },
      relations: ['meal'],
    });
  }
}
