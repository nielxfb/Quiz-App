import { Test, TestingModule } from '@nestjs/testing';
import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module.js';

describe('Quizzes (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/quizzes (POST) creates a quiz', async () => {
    const response = await request(app.getHttpServer())
      .post('/quizzes')
      .send({ title: 'Geography Basics', description: 'Capitals and flags' })
      .expect(201);

    expect(response.body).toMatchObject({ title: 'Geography Basics' });
    expect(response.body.id).toBeDefined();
  });

  it('/quizzes (POST) rejects a missing title', () => {
    return request(app.getHttpServer()).post('/quizzes').send({}).expect(400);
  });

  it('/quizzes (GET) lists quizzes', async () => {
    const response = await request(app.getHttpServer()).get('/quizzes').expect(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/quizzes/:id (GET/PATCH/DELETE) full lifecycle', async () => {
    const created = await request(app.getHttpServer())
      .post('/quizzes')
      .send({ title: 'Temp Quiz' })
      .expect(201);
    const id = created.body.id;

    await request(app.getHttpServer()).get(`/quizzes/${id}`).expect(200);

    await request(app.getHttpServer())
      .patch(`/quizzes/${id}`)
      .send({ title: 'Renamed Quiz' })
      .expect(200)
      .expect((res) => {
        expect(res.body.title).toBe('Renamed Quiz');
      });

    await request(app.getHttpServer()).delete(`/quizzes/${id}`).expect(204);
    await request(app.getHttpServer()).get(`/quizzes/${id}`).expect(404);
  });

  it.todo('/quizzes/:id (GET) returns 404 for a non-existent quiz');
  it.todo('/quizzes/:id (PATCH) returns 404 for a non-existent quiz');
});
