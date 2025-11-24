import { Controller, Post, UseGuards, Req } from '@nestjs/common';
import { SidebarService } from './sidebar.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import type { Request } from 'express';

@Controller('sidebar')
export class SidebarController {
  constructor(private readonly sidebarService: SidebarService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async getSidebar(@Req() req: Request) {
    const user = req.user as { id: number };

    return this.sidebarService.getSidebar(user.id);
  }
}
