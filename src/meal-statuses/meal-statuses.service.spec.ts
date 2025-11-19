import { Test, TestingModule } from '@nestjs/testing';
import { MealStatusesService } from './meal-statuses.service';

describe('MealStatusesService', () => {
  let service: MealStatusesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MealStatusesService],
    }).compile();

    service = module.get<MealStatusesService>(MealStatusesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
