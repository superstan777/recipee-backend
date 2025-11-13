import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MealSidebarTag } from './entities/meal_sidebar_tag.entity';

@Injectable()
export class MealSidebarTagsService {
  constructor(
    @InjectRepository(MealSidebarTag)
    private readonly mealSidebarTagRepo: Repository<MealSidebarTag>,
  ) {}

  async addTagToMeal(meal_id: number, tag_id: number) {
    const exists = await this.mealSidebarTagRepo.findOne({
      where: { meal_id, tag_id },
    });
    if (exists) return exists;

    const relation = this.mealSidebarTagRepo.create({ meal_id, tag_id });
    return this.mealSidebarTagRepo.save(relation);
  }

  async removeTagFromMeal(meal_id: number, tag_id: number) {
    await this.mealSidebarTagRepo.delete({ meal_id, tag_id });
    return { success: true };
  }

  async getTagsForMeal(meal_id: number) {
    return this.mealSidebarTagRepo.find({
      where: { meal_id },
      relations: ['tag'],
    });
  }
}
