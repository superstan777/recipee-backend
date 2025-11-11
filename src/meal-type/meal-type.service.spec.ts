import { Test, TestingModule } from '@nestjs/testing';
import { MealTypeService } from './meal-type.service';

describe('MealTypeService', () => {
  let service: MealTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MealTypeService],
    }).compile();

    service = module.get<MealTypeService>(MealTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
