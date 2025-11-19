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

  //   async getStatusesForMeals(userId: number, mealIds: number[]) {
  //     if (!mealIds || mealIds.length === 0) return [];

  //     // Pobierz istniejące statusy
  //     const existing = await this.statusRepo.find({
  //       where: {
  //         user: { id: userId },
  //         meal: { id: In(mealIds) },
  //       },
  //       relations: ['meal'],
  //     });

  //     const existingMealIds = new Set(existing.map((s) => s.meal.id));

  //     // Lista brakujących posiłków
  //     const missing = mealIds.filter((id) => !existingMealIds.has(id));

  //     let created: MealStatus[] = [];

  //     if (missing.length > 0) {
  //       const toCreate = missing.map((mealId) =>
  //         this.statusRepo.create({
  //           user: { id: userId },
  //           meal: { id: mealId },
  //           hidden: false,
  //           new: true,
  //           rating: null,
  //         }),
  //       );

  //       created = await this.statusRepo.save(toCreate);
  //     }

  //     return [...existing, ...created];
  //   }
  //   async getStatusesForMeals(userId: number, mealIds: number[]) {
  //     if (!mealIds || mealIds.length === 0) return [];

  //     // Pobierz istniejące statusy
  //     const existing = await this.statusRepo.find({
  //       where: {
  //         user: { id: userId },
  //         meal: { id: In(mealIds) },
  //       },
  //       relations: ['meal'],
  //     });

  //     const existingMealIds = new Set(existing.map((s) => s.meal.id));

  //     // Lista brakujących posiłków
  //     const missing = mealIds.filter((id) => !existingMealIds.has(id));

  //     if (missing.length > 0) {
  //       // Insert brakujących rekordów bez pobierania pełnych encji
  //       const insertData = missing.map((mealId) => ({
  //         user: { id: userId },
  //         meal: { id: mealId },
  //         hidden: false,
  //         new: true,
  //         rating: null,
  //       }));

  //       await this.statusRepo
  //         .createQueryBuilder()
  //         .insert()
  //         .into(MealStatus)
  //         .values(insertData)
  //         .execute();

  //       // Pobierz utworzone rekordy z DB
  //       const created = await this.statusRepo.find({
  //         where: {
  //           user: { id: userId },
  //           meal: { id: In(missing) },
  //         },
  //         relations: ['meal'],
  //       });

  //       return [...existing, ...created];
  //     }

  //     return existing;
  //   }
  async getStatusesForMeals(userId: number, mealIds: number[]) {
    if (!mealIds || mealIds.length === 0) return [];

    // Pobierz istniejące statusy
    const existing = await this.statusRepo.find({
      where: {
        user: { id: userId },
        meal: { id: In(mealIds) },
      },
      relations: ['meal', 'user'],
    });

    const existingMealIds = new Set(existing.map((s) => s.meal.id));

    // Lista brakujących posiłków
    const missingIds = mealIds.filter((id) => !existingMealIds.has(id));

    let created: MealStatus[] = [];

    if (missingIds.length > 0) {
      // Pobierz użytkownika raz
      const user = await this.usersRepo.findOne({ where: { id: userId } });
      if (!user) throw new Error(`User ${userId} not found`);

      // Pobierz wszystkie brakujące posiłki
      const missingMeals = await this.mealsRepo.find({
        where: { id: In(missingIds) },
      });

      // Tworzymy encje MealStatus
      const toCreate = missingMeals.map((meal) =>
        this.statusRepo.create({
          user,
          meal,
          hidden: false,
          new: true,
          rating: null,
        }),
      );

      // Zapisujemy je do bazy
      created = await this.statusRepo.save(toCreate);
    }

    return [...existing, ...created];
  }
}
