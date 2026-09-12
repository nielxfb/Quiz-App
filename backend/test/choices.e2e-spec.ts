import { Test, TestingModule } from '@nestjs/testing';
import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module.js';
import { registerAndLogin } from './setup/auth-helper.js';

describe('Choices (e2e)', () => {
  let app: INestApplication<App>;
  let agent: Awaited<ReturnType<typeof registerAndLogin>>['agent'];
  let quizId: string;
  let questionId: string;

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

    const quiz = await agent.post('/quizzes').send({ title: 'Choices Test Quiz' });
    quizId = quiz.body.id;

    const question = await agent
      .post(`/quizzes/${quizId}/questions`)
      .send({ text: 'Pick the correct one' });
    questionId = question.body.id;
  });

  afterAll(async () => {
    await agent.delete(`/quizzes/${quizId}`);
    await app.close();
  });

  it('/questions/:questionId/choices (POST) creates a choice for the question', async () => {
    const response = await agent
      .post(`/questions/${questionId}/choices`)
      .send({ text: 'Correct answer', isCorrect: true })
      .expect(201);

    expect(response.body).toMatchObject({ text: 'Correct answer', isCorrect: true });
  });

  it('/questions/:questionId/choices (POST) returns 404 for a non-existent question', () => {
    return agent
      .post('/questions/00000000-0000-0000-0000-000000000000/choices')
      .send({ text: 'Orphan choice' })
      .expect(404);
  });

  it('/questions/:questionId/choices (GET) lists choices for the question', async () => {
    const response = await agent.get(`/questions/${questionId}/choices`).expect(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/choices/:id (GET/PATCH/DELETE) full lifecycle', async () => {
    const created = await agent
      .post(`/questions/${questionId}/choices`)
      .send({ text: 'Temp choice' })
      .expect(201);
    const id = created.body.id;

    await agent.get(`/choices/${id}`).expect(200);

    await agent
      .patch(`/choices/${id}`)
      .send({ isCorrect: true })
      .expect(200)
      .expect((res) => {
        expect(res.body.isCorrect).toBe(true);
      });

    await agent.delete(`/choices/${id}`).expect(200);
    await agent.get(`/choices/${id}`).expect(404);
  });

  it.todo('/choices/:id (GET) returns 404 for a non-existent choice');
});
