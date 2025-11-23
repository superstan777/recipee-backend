import { Test, TestingModule } from '@nestjs/testing';
import { MealStatusesController } from './meal-statuses.controller';

describe('MealStatusesController', () => {
  let controller: MealStatusesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MealStatusesController],
    }).compile();

    controller = module.get<MealStatusesController>(MealStatusesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
