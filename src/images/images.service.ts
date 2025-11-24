import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepo: Repository<Image>,
  ) {}

  async getRandomImage(): Promise<Image | null> {
    const count = await this.imageRepo.count();
    if (count === 0) return null;

    const randomIndex = Math.floor(Math.random() * count);

    const images = await this.imageRepo.find({
      skip: randomIndex,
      take: 1,
    });

    return images[0] ?? null;
  }
}
