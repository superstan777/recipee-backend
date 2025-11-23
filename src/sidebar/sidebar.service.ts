import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MealType } from '../meal-types/entities/meal_types.entity';
import { SidebarTag } from 'src/sidebar-tags/entities/sidebar_tag.entity';

@Injectable()
export class SidebarService {
  constructor(
    @InjectRepository(MealType)
    private readonly mealTypeRepo: Repository<MealType>,
    @InjectRepository(SidebarTag)
    private readonly sidebarTagRepo: Repository<SidebarTag>,
  ) {}

  async getSidebar(
    user_id: number,
  ): Promise<
    { id: number; name: string; tags: { id: number; tag_name: string }[] }[]
  > {
    const mealTypes = await this.mealTypeRepo.find({
      order: { id: 'ASC' },
      relations: ['sidebar_tags'],
    });

    return mealTypes.map((mt) => ({
      id: mt.id,
      name: mt.name,
      tags: mt.sidebar_tags
        .filter((tag) => tag.user_id === user_id) // <- filtr po user_id
        .map((tag) => ({
          id: tag.id,
          tag_name: tag.tag_name,
        })),
    }));
  }
}
