import { Test, TestingModule } from '@nestjs/testing';
import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module.js';
import { registerAndLogin } from './setup/auth-helper.js';

describe('Quizzes (e2e)', () => {
  let app: INestApplication<App>;
  let agent: Awaited<ReturnType<typeof registerAndLogin>>['agent'];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    await app.init();

    ({ agent } = await registerAndLogin(app));
  });

  afterAll(async () => {
    await app.close();
  });

  it('/quizzes (POST) creates a quiz', async () => {
    const response = await agent
      .post('/quizzes')
      .send({ title: 'Geography Basics', description: 'Capitals and flags' })
      .expect(201);

    expect(response.body).toMatchObject({ title: 'Geography Basics' });
    expect(response.body.id).toBeDefined();
  });

  it('/quizzes (POST) rejects a missing title', () => {
    return agent.post('/quizzes').send({}).expect(400);
  });

  it('/quizzes (GET) lists quizzes', async () => {
    const response = await agent.get('/quizzes').expect(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/quizzes/:id (GET/PATCH/DELETE) full lifecycle', async () => {
    const created = await agent.post('/quizzes').send({ title: 'Temp Quiz' }).expect(201);
    const id = created.body.id;

    await agent.get(`/quizzes/${id}`).expect(200);

    await agent
      .patch(`/quizzes/${id}`)
      .send({ title: 'Renamed Quiz' })
      .expect(200)
      .expect((res) => {
        expect(res.body.title).toBe('Renamed Quiz');
      });

    await agent.delete(`/quizzes/${id}`).expect(204);
    await agent.get(`/quizzes/${id}`).expect(404);
  });

  it.todo('/quizzes/:id (GET) returns 404 for a non-existent quiz');
  it.todo('/quizzes/:id (PATCH) returns 404 for a non-existent quiz');
});
