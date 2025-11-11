import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MealsService } from '../meals/meals.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(private readonly mealsService: MealsService) {}

  // example: run every day at 3:00
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async handleDailySync() {
    this.logger.log('Starting daily sync...');
    // await this.mealsService.syncFromApi();
  }
}
