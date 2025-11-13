import { Test, TestingModule } from '@nestjs/testing';
import { SidebarTagsController } from './sidebar-tags.controller';

describe('SidebarTagsController', () => {
  let controller: SidebarTagsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SidebarTagsController],
    }).compile();

    controller = module.get<SidebarTagsController>(SidebarTagsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
