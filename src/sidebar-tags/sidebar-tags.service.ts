import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SidebarTag } from './entities/sidebar_tag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SidebarTagsService {
  constructor(
    @InjectRepository(SidebarTag)
    private readonly sidebarTagRepo: Repository<SidebarTag>,
  ) {}

  async createTag(user_id: number, meal_type_id: number, tag_name: string) {
    const existing = await this.sidebarTagRepo.findOne({
      where: { user_id, meal_type_id, tag_name },
    });

    if (existing) {
      throw new ConflictException('Tag o takiej nazwie już istnieje');
    }

    const tag = this.sidebarTagRepo.create({
      user_id,
      meal_type_id,
      tag_name,
    });

    return this.sidebarTagRepo.save(tag);
  }

  async findByMealType(user_id: number, meal_type_id: number) {
    return this.sidebarTagRepo.find({
      where: { user_id, meal_type_id },
    });
  }
}
