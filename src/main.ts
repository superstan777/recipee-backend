import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeDatabase } from './database/data-source';

async function bootstrap() {
  await initializeDatabase();

  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: process.env.ORIGIN_URL });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
