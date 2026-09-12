import { Test, TestingModule } from '@nestjs/testing';
import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module.js';
import { registerAndLogin } from './setup/auth-helper.js';

describe('Questions (e2e)', () => {
  let app: INestApplication<App>;
  let agent: Awaited<ReturnType<typeof registerAndLogin>>['agent'];
  let quizId: string;

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

    const quiz = await agent.post('/quizzes').send({ title: 'Questions Test Quiz' });
    quizId = quiz.body.id;
  });

  afterAll(async () => {
    await agent.delete(`/quizzes/${quizId}`);
    await app.close();
  });

  it('/quizzes/:quizId/questions (POST) creates a question for the quiz', async () => {
    const response = await agent
      .post(`/quizzes/${quizId}/questions`)
      .send({ text: 'What is the capital of France?' })
      .expect(201);

    expect(response.body).toMatchObject({ text: 'What is the capital of France?' });
  });

  it('/quizzes/:quizId/questions (POST) returns 404 for a non-existent quiz', () => {
    return agent
      .post('/quizzes/00000000-0000-0000-0000-000000000000/questions')
      .send({ text: 'Orphan question' })
      .expect(404);
  });

  it('/quizzes/:quizId/questions (GET) lists questions for the quiz', async () => {
    const response = await agent.get(`/quizzes/${quizId}/questions`).expect(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/questions/:id (GET/PATCH/DELETE) full lifecycle', async () => {
    const created = await agent
      .post(`/quizzes/${quizId}/questions`)
      .send({ text: 'Temp question' })
      .expect(201);
    const id = created.body.id;

    await agent.get(`/questions/${id}`).expect(200);

    await agent.patch(`/questions/${id}`).send({ text: 'Updated question' }).expect(200);

    await agent.delete(`/questions/${id}`).expect(200);
    await agent.get(`/questions/${id}`).expect(404);
  });

  it.todo('/questions/:id (GET) returns 404 for a non-existent question');
});
