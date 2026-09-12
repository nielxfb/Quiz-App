import type { INestApplication } from '@nestjs/common';
import request from 'supertest';

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
