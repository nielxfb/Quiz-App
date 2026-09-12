import { config } from 'dotenv';
import { Client } from 'pg';

config();

const email = process.argv[2];
if (!email) {
  console.error('Usage: npm run promote-admin -- <email>');
  process.exit(1);
}

const client = new Client({
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  user: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'quiz_app',
});

await client.connect();
const result = await client.query(
  'UPDATE "user" SET role = $1 WHERE email = $2 RETURNING id, username, email, role',
  ['admin', email],
);
await client.end();

if (result.rowCount === 0) {
  console.error(`No user found with email ${email}`);
  process.exit(1);
}

console.log('Promoted to admin:', result.rows[0]);
