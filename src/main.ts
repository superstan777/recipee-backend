import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeDatabase } from './database/data-source';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  await initializeDatabase();

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.ORIGIN_URL,
    credentials: true,
  });

  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
