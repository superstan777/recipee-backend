import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

const databasePath = join(__dirname, '..', '..', 'database', 'meals.db');

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: databasePath,
  entities: [join(__dirname, '/../**/*.entity.{ts,js}')],
  synchronize: true, // tylko w dev
};
