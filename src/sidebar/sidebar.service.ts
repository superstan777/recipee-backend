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

  /**
   * Zwraca sidebar w pełnej strukturze:
   * [
   *   { id, name, tags: [{ id, tag_name }, ...] },
   *   ...
   * ]
   */
  async getSidebar(): Promise<
    { id: number; name: string; tags: { id: number; tag_name: string }[] }[]
  > {
    // pobieramy meal types z tagami
    const mealTypes = await this.mealTypeRepo.find({
      order: { id: 'ASC' },
      relations: ['sidebar_tags'], // fetchujemy powiązane sidebar_tags
    });

    return mealTypes.map((mt) => ({
      id: mt.id,
      name: mt.name,
      tags: mt.sidebar_tags.map((tag) => ({
        id: tag.id,
        tag_name: tag.tag_name,
      })),
    }));
  }
}
