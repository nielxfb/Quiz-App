import { Test, TestingModule } from '@nestjs/testing';
import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module.js';
import { registerAdminAndLogin, registerAndLogin } from './setup/auth-helper.js';

describe('Attempts (e2e)', () => {
  let app: INestApplication<App>;
  let agent: Awaited<ReturnType<typeof registerAndLogin>>['agent'];
  let userId: string;
  let quizId: string;
  let questionId: string;
  let correctChoiceId: string;
  let wrongChoiceId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    await app.init();

    ({ agent, userId } = await registerAdminAndLogin(app));

    const quiz = await agent.post('/quizzes').send({ title: 'Attempts Test Quiz' });
    quizId = quiz.body.id;

    const question = await agent.post(`/quizzes/${quizId}/questions`).send({ text: '2 + 2 = ?' });
    questionId = question.body.id;

    const correct = await agent
      .post(`/questions/${questionId}/choices`)
      .send({ text: '4', isCorrect: true });
    correctChoiceId = correct.body.id;

    const wrong = await agent
      .post(`/questions/${questionId}/choices`)
      .send({ text: '5', isCorrect: false });
    wrongChoiceId = wrong.body.id;
  });

  afterAll(async () => {
    await agent.delete(`/quizzes/${quizId}`);
    await app.close();
  });

  it('/quizzes/:quizId/attempts (POST) starts an attempt for the logged-in user', async () => {
    const response = await agent.post(`/quizzes/${quizId}/attempts`).expect(201);

    expect(response.body.score).toBe(0);
    expect(response.body.id).toBeDefined();
  });

  it('/quizzes/:quizId/attempts (POST) requires authentication', () => {
    return request(app.getHttpServer()).post(`/quizzes/${quizId}/attempts`).expect(401);
  });

  it('full attempt flow: answer -> submit -> correct score', async () => {
    const attempt = await agent.post(`/quizzes/${quizId}/attempts`).expect(201);
    const attemptId = attempt.body.id;

    await agent
      .post(`/attempts/${attemptId}/answers`)
      .send({ questionId, choiceId: correctChoiceId })
      .expect(201);

    const submitted = await agent.post(`/attempts/${attemptId}/submit`).expect(201);
    expect(submitted.body.score).toBe(1);
  });

  it('/attempts/:id/answers (POST) rejects a choice from another question', async () => {
    const attempt = await agent.post(`/quizzes/${quizId}/attempts`).expect(201);

    return agent
      .post(`/attempts/${attempt.body.id}/answers`)
      .send({ questionId: '00000000-0000-0000-0000-000000000000', choiceId: wrongChoiceId })
      .expect(400);
  });

  it('/quizzes/:quizId/attempts (GET) lists attempts for the quiz', async () => {
    const response = await agent.get(`/quizzes/${quizId}/attempts`).expect(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/users/:id/attempts (GET) lists attempts for the user', async () => {
    const response = await agent.get(`/users/${userId}/attempts`).expect(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/users/:id/quizzes (GET) lists quizzes the user has attempted', async () => {
    const response = await agent.get(`/users/${userId}/quizzes`).expect(200);
    expect(response.body.some((quiz: { id: string }) => quiz.id === quizId)).toBe(true);
  });

  it.todo('/attempts/:id (DELETE) removes an attempt');
  it.todo('/attempts/:id/answers (POST) overwrites a previous answer to the same question');
});
