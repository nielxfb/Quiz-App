import { config } from 'dotenv';
import { Client } from 'pg';

export default async function globalSetup() {
  config({ path: '.env.test', override: true });

  const dbName = process.env.DB_NAME ?? '';
  if (!dbName.endsWith('_test')) {
    throw new Error(
      `Refusing to reset database "${dbName}": e2e tests must target a database name ending in "_test". Check .env.test.`,
    );
  }

  const client = new Client({
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    database: dbName,
  });

  await client.connect();
  await client.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
  await client.end();
}
