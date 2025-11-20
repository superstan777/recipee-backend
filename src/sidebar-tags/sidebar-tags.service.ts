import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SidebarTag } from './entities/sidebar_tag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SidebarTagsService {
  constructor(
    @InjectRepository(SidebarTag)
    private readonly sidebarTagRepo: Repository<SidebarTag>,
  ) {}

  async create(meal_type_id: number, tag_name: string, user_id: number) {
    const tag = this.sidebarTagRepo.create({
      meal_type_id,
      tag_name,
      user_id,
    });

    return this.sidebarTagRepo.save(tag);
  }

  async findAll(user_id: number) {
    return this.sidebarTagRepo.find({
      where: { user_id },
      relations: ['meal_type'],
    });
  }

  async findByMealType(meal_type_id: number, user_id: number) {
    return this.sidebarTagRepo.find({
      where: { meal_type_id, user_id },
    });
  }
}
