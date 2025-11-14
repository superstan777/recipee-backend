import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MealTag } from './entities/meal-tag.entity';
import { Meal } from '../meals/entities/meal.entity';
import { SidebarTag } from '../sidebar-tags/entities/sidebar_tag.entity';

@Injectable()
export class MealTagsService {
  constructor(
    @InjectRepository(MealTag)
    private readonly mealTagRepo: Repository<MealTag>,
    @InjectRepository(Meal)
    private readonly mealRepo: Repository<Meal>,
    @InjectRepository(SidebarTag)
    private readonly tagRepo: Repository<SidebarTag>,
  ) {}

  async addTagToMeal(mealId: number, tagId: number) {
    // const meal = await this.mealRepo.findOne({ where: { id: mealId } });
    const meal = await this.mealRepo.findOne({ where: { id: mealId } });
    if (!meal) throw new Error(`Meal with id ${mealId} not found`);

    const tag = await this.tagRepo.findOne({ where: { id: tagId } });
    if (!tag) throw new Error(`Tag with id ${tagId} not found`);

    const exists = await this.mealTagRepo.findOne({
      where: { meal: { id: mealId }, tag: { id: tagId } },
    });
    if (exists) return exists;

    const relation = this.mealTagRepo.create({ meal, tag });
    return this.mealTagRepo.save(relation);
  }

  async removeTagFromMeal(mealId: number, tagId: number) {
    await this.mealTagRepo.delete({ meal: { id: mealId }, tag: { id: tagId } });
    return { success: true };
  }

  async getTagsForMeal(mealId: number) {
    return this.mealTagRepo.find({
      where: { meal: { id: mealId } },
      relations: ['tag'],
    });
  }

  async getMealsByTag(tagId: number) {
    return this.mealTagRepo.find({
      where: { tag: { id: tagId } },
      relations: ['meal', 'tag'],
    });
  }
}
