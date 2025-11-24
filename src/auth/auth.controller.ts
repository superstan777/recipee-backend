// auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response, Request } from 'express';

import { JwtAuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.auth.login(body.email, body.password);

    res.cookie('access_token', token, {
      // httpOnly: true,
      // secure: true,
      // maxAge: 1000 * 60 * 60 * 24 * 30, // 30 dni
      // sameSite: 'none',
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    return { message: 'Login successful' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req: Request) {
    return req.user;
  }
}
