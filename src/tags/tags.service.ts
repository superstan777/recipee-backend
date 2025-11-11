import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomTag } from './entities/custom_tag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(CustomTag)
    private readonly customTagRepo: Repository<CustomTag>,
  ) {}

  // add/get tag logic
}
