import { Test, TestingModule } from '@nestjs/testing';
import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module.js';

describe('Attempts (e2e)', () => {
  let app: INestApplication<App>;
  let quizId: string;
  let questionId: string;
  let correctChoiceId: string;
  let wrongChoiceId: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    await app.init();

    const quiz = await request(app.getHttpServer())
      .post('/quizzes')
      .send({ title: 'Attempts Test Quiz' });
    quizId = quiz.body.id;

    const question = await request(app.getHttpServer())
      .post(`/quizzes/${quizId}/questions`)
      .send({ text: '2 + 2 = ?' });
    questionId = question.body.id;

    const correct = await request(app.getHttpServer())
      .post(`/questions/${questionId}/choices`)
      .send({ text: '4', isCorrect: true });
    correctChoiceId = correct.body.id;

    const wrong = await request(app.getHttpServer())
      .post(`/questions/${questionId}/choices`)
      .send({ text: '5', isCorrect: false });
    wrongChoiceId = wrong.body.id;

    const runId = Date.now();
    const user = await request(app.getHttpServer())
      .post('/users')
      .send({
        username: `attempter-${runId}`,
        email: `attempter-${runId}@example.com`,
        password: 'password123',
      });
    userId = user.body.id;
  });

  afterAll(async () => {
    await request(app.getHttpServer()).delete(`/quizzes/${quizId}`);
    await request(app.getHttpServer()).delete(`/users/${userId}`);
    await app.close();
  });

  it('/quizzes/:quizId/attempts (POST) starts an attempt for a user', async () => {
    const response = await request(app.getHttpServer())
      .post(`/quizzes/${quizId}/attempts`)
      .send({ userId })
      .expect(201);

    expect(response.body.score).toBe(0);
    expect(response.body.id).toBeDefined();
  });

  it('/quizzes/:quizId/attempts (POST) starts an anonymous attempt', () => {
    return request(app.getHttpServer()).post(`/quizzes/${quizId}/attempts`).send({}).expect(201);
  });

  it('full attempt flow: answer -> submit -> correct score', async () => {
    const attempt = await request(app.getHttpServer())
      .post(`/quizzes/${quizId}/attempts`)
      .send({ userId })
      .expect(201);
    const attemptId = attempt.body.id;

    await request(app.getHttpServer())
      .post(`/attempts/${attemptId}/answers`)
      .send({ questionId, choiceId: correctChoiceId })
      .expect(201);

    const submitted = await request(app.getHttpServer())
      .post(`/attempts/${attemptId}/submit`)
      .expect(201);
    expect(submitted.body.score).toBe(1);
  });

  it('/attempts/:id/answers (POST) rejects a choice from another question', async () => {
    const attempt = await request(app.getHttpServer())
      .post(`/quizzes/${quizId}/attempts`)
      .send({ userId })
      .expect(201);

    return request(app.getHttpServer())
      .post(`/attempts/${attempt.body.id}/answers`)
      .send({ questionId: '00000000-0000-0000-0000-000000000000', choiceId: wrongChoiceId })
      .expect(400);
  });

  it('/quizzes/:quizId/attempts (GET) lists attempts for the quiz', async () => {
    const response = await request(app.getHttpServer())
      .get(`/quizzes/${quizId}/attempts`)
      .expect(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/users/:id/attempts (GET) lists attempts for the user', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/${userId}/attempts`)
      .expect(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/users/:id/quizzes (GET) lists quizzes the user has attempted', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/${userId}/quizzes`)
      .expect(200);
    expect(response.body.some((quiz: { id: string }) => quiz.id === quizId)).toBe(true);
  });

  it.todo('/attempts/:id (DELETE) removes an attempt');
  it.todo('/attempts/:id/answers (POST) overwrites a previous answer to the same question');
});
