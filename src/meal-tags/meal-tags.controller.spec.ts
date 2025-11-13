import { Test, TestingModule } from '@nestjs/testing';
import { MealTagsController } from './meal-tags.controller';

describe('MealTagsController', () => {
  let controller: MealTagsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MealTagsController],
    }).compile();

    controller = module.get<MealTagsController>(MealTagsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
