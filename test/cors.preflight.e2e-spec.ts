import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

describe('CORS preflight (OPTIONS) buildings/:id', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    // Same CORS config as main.ts
    app.enableCors({
      origin: ['http://localhost:5173'],
      methods: 'GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS',
      allowedHeaders: 'Authorization,Content-Type,Accept',
      credentials: true,
    });

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should allow PATCH in Access-Control-Allow-Methods', async () => {
    const id = 'ecca1ab6-dcff-4252-96bd-ba5412fca436';
    const res = await request(app.getHttpServer())
      .options(`/api/v1/buildings/${id}`)
      .set('Origin', 'http://localhost:5173')
      .set('Access-Control-Request-Method', 'PATCH')
      .set('Access-Control-Request-Headers', 'authorization, content-type');

    expect([200, 204]).toContain(res.status);
    expect(res.headers['access-control-allow-origin']).toBe(
      'http://localhost:5173',
    );
    expect(res.headers['access-control-allow-methods']).toContain('PATCH');
    expect(res.headers['access-control-allow-headers']).toMatch(
      /authorization/i,
    );
  });

  it('should handle OPTIONS for buildings collection', async () => {
    const res = await request(app.getHttpServer())
      .options('/api/v1/buildings')
      .set('Origin', 'http://localhost:5173')
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'authorization, content-type');

    expect([200, 204]).toContain(res.status);
    expect(res.headers['access-control-allow-origin']).toBe(
      'http://localhost:5173',
    );
    expect(res.headers['access-control-allow-methods']).toContain('POST');
  });
});
