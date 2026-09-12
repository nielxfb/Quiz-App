import { Test, TestingModule } from '@nestjs/testing';
import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module.js';

describe('Questions (e2e)', () => {
  let app: INestApplication<App>;
  let quizId: string;

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
      .send({ title: 'Questions Test Quiz' });
    quizId = quiz.body.id;
  });

  afterAll(async () => {
    await request(app.getHttpServer()).delete(`/quizzes/${quizId}`);
    await app.close();
  });

  it('/quizzes/:quizId/questions (POST) creates a question for the quiz', async () => {
    const response = await request(app.getHttpServer())
      .post(`/quizzes/${quizId}/questions`)
      .send({ text: 'What is the capital of France?' })
      .expect(201);

    expect(response.body).toMatchObject({ text: 'What is the capital of France?' });
  });

  it('/quizzes/:quizId/questions (POST) returns 404 for a non-existent quiz', () => {
    return request(app.getHttpServer())
      .post('/quizzes/00000000-0000-0000-0000-000000000000/questions')
      .send({ text: 'Orphan question' })
      .expect(404);
  });

  it('/quizzes/:quizId/questions (GET) lists questions for the quiz', async () => {
    const response = await request(app.getHttpServer())
      .get(`/quizzes/${quizId}/questions`)
      .expect(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/questions/:id (GET/PATCH/DELETE) full lifecycle', async () => {
    const created = await request(app.getHttpServer())
      .post(`/quizzes/${quizId}/questions`)
      .send({ text: 'Temp question' })
      .expect(201);
    const id = created.body.id;

    await request(app.getHttpServer()).get(`/questions/${id}`).expect(200);

    await request(app.getHttpServer())
      .patch(`/questions/${id}`)
      .send({ text: 'Updated question' })
      .expect(200);

    await request(app.getHttpServer()).delete(`/questions/${id}`).expect(200);
    await request(app.getHttpServer()).get(`/questions/${id}`).expect(404);
  });

  it.todo('/questions/:id (GET) returns 404 for a non-existent question');
});
