import { Test, TestingModule } from '@nestjs/testing';
import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module.js';
import { registerAdminAndLogin, registerAndLogin } from './setup/auth-helper.js';

describe('Users (e2e)', () => {
  let app: INestApplication<App>;
  let agent: Awaited<ReturnType<typeof registerAndLogin>>['agent'];
  const runId = Date.now();
  const username = `quizzer-${runId}`;
  const email = `user-${runId}@example.com`;
  let createdUserId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    await app.init();

    ({ agent } = await registerAdminAndLogin(app));
  });

  afterAll(async () => {
    if (createdUserId) {
      await agent.delete(`/users/${createdUserId}`);
    }
    await app.close();
  });

  // POST /users is a public (unauthenticated) endpoint - use a plain request, not the logged-in agent.
  it('/users (POST) creates a user without leaking the password', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({ username, email, password: 'supersecret123' })
      .expect(201);

    expect(response.body).toMatchObject({ username, email, role: 'user' });
    expect(response.body.password).toBeUndefined();
    createdUserId = response.body.id;
  });

  it('/users (POST) rejects a duplicate email', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ username: `${username}-dup`, email, password: 'supersecret123' })
      .expect(409);
  });

  it('/users (POST) rejects an invalid email / short password', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ username: 'bad', email: 'not-an-email', password: 'short' })
      .expect(400);
  });

  it('/users (GET) lists users for an admin', async () => {
    const response = await agent.get('/users').expect(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/users (GET) is forbidden for a non-admin user', async () => {
    const { agent: userAgent } = await registerAndLogin(app);
    return userAgent.get('/users').expect(403);
  });

  it('/users/:id (GET/PATCH/DELETE) full lifecycle as admin', async () => {
    const created = await request(app.getHttpServer())
      .post('/users')
      .send({
        username: `temp-${runId}`,
        email: `temp-${runId}@example.com`,
        password: 'password123',
      })
      .expect(201);
    const id = created.body.id;

    await agent.get(`/users/${id}`).expect(200);

    await agent
      .patch(`/users/${id}`)
      .send({ username: `renamed-${runId}` })
      .expect(200)
      .expect((res) => {
        expect(res.body.username).toBe(`renamed-${runId}`);
      });

    await agent.delete(`/users/${id}`).expect(200);
    await agent.get(`/users/${id}`).expect(404);
  });

  it('/users/:id/role (PATCH) promotes and demotes a user', async () => {
    const created = await request(app.getHttpServer())
      .post('/users')
      .send({
        username: `promote-${runId}`,
        email: `promote-${runId}@example.com`,
        password: 'password123',
      })
      .expect(201);
    const id = created.body.id;

    await agent
      .patch(`/users/${id}/role`)
      .send({ role: 'admin' })
      .expect(200)
      .expect((res) => {
        expect(res.body.role).toBe('admin');
      });

    await agent
      .patch(`/users/${id}/role`)
      .send({ role: 'user' })
      .expect(200)
      .expect((res) => {
        expect(res.body.role).toBe('user');
      });

    await agent.delete(`/users/${id}`).expect(200);
  });

  it('/users/:id/role (PATCH) rejects an invalid role', async () => {
    return agent.patch(`/users/${createdUserId}/role`).send({ role: 'superadmin' }).expect(400);
  });

  it.todo('/users/:id/attempts (GET) lists a user’s attempt history');
  it.todo('/users/:id/quizzes (GET) lists quizzes a user has attempted');
});
