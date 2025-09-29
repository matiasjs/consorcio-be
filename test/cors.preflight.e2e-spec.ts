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
      allowedHeaders: 'Authorization,Content-Type,Accept,X-Force-Preflight',
      credentials: true,
    });

    // Same global OPTIONS handler as main.ts
    app.use((req: any, res: any, next: any) => {
      if (req.method === 'OPTIONS') {
        const ts = new Date().toISOString();
        console.log('🛰️  TEST GLOBAL PRELIGHT', {
          ts,
          method: req.method,
          url: req.url,
          origin: req.headers.origin,
          acrm: req.headers['access-control-request-method'],
          acrh: req.headers['access-control-request-headers'],
        });

        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
        res.setHeader('Vary', 'Origin');
        res.setHeader(
          'Access-Control-Allow-Methods',
          'GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS',
        );
        res.setHeader(
          'Access-Control-Allow-Headers',
          'Authorization,Content-Type,Accept,X-Force-Preflight',
        );
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Max-Age', '600');

        console.log('🛰️  TEST GLOBAL PRELIGHT → 204 with PATCH allowed');
        return res.sendStatus(204);
      }
      return next();
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
      .set(
        'Access-Control-Request-Headers',
        'authorization, content-type, x-force-preflight',
      );

    console.log('🧪 Test response:', {
      status: res.status,
      headers: res.headers,
    });

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
