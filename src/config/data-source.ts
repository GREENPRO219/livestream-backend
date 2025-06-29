import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { getDatabaseConfig } from './database.config';

config();

export default new DataSource({
  ...getDatabaseConfig(),
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  logging: true,
}); 