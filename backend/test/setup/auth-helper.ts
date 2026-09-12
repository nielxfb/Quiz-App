import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Client } from 'pg';

export async function registerAndLogin(app: INestApplication) {
  const runId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const email = `e2e-${runId}@example.com`;
  const password = 'password123';
  const agent = request.agent(app.getHttpServer());

  const user = await agent
    .post('/users')
    .send({ username: `e2e-${runId}`, email, password })
    .expect(201);

  await agent.post('/auth/login').send({ email, password }).expect(200);

  return { agent, userId: user.body.id as string };
}

// There is no API to create the first admin (by design - see scripts/promote-admin.mjs),
// so tests promote a freshly-registered user directly via the test database, mirroring how
// a real admin would be bootstrapped.
export async function registerAdminAndLogin(app: INestApplication) {
  const result = await registerAndLogin(app);

  const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  await client.connect();
  await client.query('UPDATE "user" SET role = $1 WHERE id = $2', ['admin', result.userId]);
  await client.end();

  return result;
}
