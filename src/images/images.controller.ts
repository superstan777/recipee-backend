import { Controller, Get, NotFoundException } from '@nestjs/common';
import { ImagesService } from './images.service';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get('random')
  async getRandomImage() {
    const img = await this.imagesService.getRandomImage();

    if (!img) {
      throw new NotFoundException('No images found');
    }

    return img;
  }
}
