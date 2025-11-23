import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MealTag } from './entities/meal-tag.entity';
import { Meal } from '../meals/entities/meal.entity';
import { SidebarTag } from '../sidebar-tags/entities/sidebar_tag.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MealTagsService {
  constructor(
    @InjectRepository(MealTag)
    private readonly mealTagRepo: Repository<MealTag>,

    @InjectRepository(Meal)
    private readonly mealRepo: Repository<Meal>,

    @InjectRepository(SidebarTag)
    private readonly tagRepo: Repository<SidebarTag>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // ============================================
  // ADD TAG TO MEAL
  // ============================================
  async addTagToMeal(userId: number, mealId: number, tagId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error(`User ${userId} not found`);

    const meal = await this.mealRepo.findOne({ where: { id: mealId } });
    if (!meal) throw new Error(`Meal ${mealId} not found`);

    const tag = await this.tagRepo.findOne({
      where: { id: tagId, user: { id: userId } },
    });
    if (!tag) throw new Error(`Tag ${tagId} not found for user ${userId}`);

    const exists = await this.mealTagRepo.findOne({
      where: {
        user: { id: userId },
        meal: { id: mealId },
        tag: { id: tagId },
      },
    });

    if (exists) return exists;

    const relation = this.mealTagRepo.create({
      user,
      meal,
      tag,
    });

    return this.mealTagRepo.save(relation);
  }

  // ============================================
  // REMOVE TAG FROM MEAL
  // ============================================
  async removeTagFromMeal(userId: number, mealId: number, tagId: number) {
    await this.mealTagRepo.delete({
      user: { id: userId },
      meal: { id: mealId },
      tag: { id: tagId },
    });

    return { success: true };
  }

  // ============================================
  // GET TAGS FOR MEAL
  // ============================================
  async getTagsForMeal(userId: number, mealId: number) {
    return this.mealTagRepo.find({
      where: {
        user: { id: userId },
        meal: { id: mealId },
      },
      relations: ['tag'],
    });
  }

  // ============================================
  // GET MEALS BY TAG
  // ============================================
  async getMealsByTag(userId: number, tagId: number) {
    return this.mealTagRepo.find({
      where: {
        user: { id: userId },
        tag: { id: tagId },
      },
      relations: ['meal'],
    });
  }
}
