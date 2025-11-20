import { Controller, Post, Body } from '@nestjs/common';
import { SidebarService } from './sidebar.service';

@Controller('sidebar')
export class SidebarController {
  constructor(private readonly sidebarService: SidebarService) {}

  @Post()
  async getSidebar(@Body('user_id') user_id: number) {
    return this.sidebarService.getSidebar(user_id);
  }
}
