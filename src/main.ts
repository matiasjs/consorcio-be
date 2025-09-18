// Web Crypto en Node (solo si falta)
import { webcrypto as nodeCrypto } from 'node:crypto';
globalThis.crypto ??= nodeCrypto as unknown as Crypto;

import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

function parseCorsOrigins(input?: string | string[]): string[] {
  if (!input) return ['http://localhost:3000'];
  if (Array.isArray(input)) return input;
  // admite CSV en env: APP_CORS_ORIGIN="http://a.com,http://b.com"
  return input
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: configService.get<string>('app.apiVersion', 'v1'),
  });

  // Global prefix
  app.setGlobalPrefix(configService.get<string>('app.apiPrefix', 'api'));

  // CORS
  const corsOrigin = parseCorsOrigins(
    configService.get<string | string[]>('app.corsOrigin'),
  );
  app.enableCors({ origin: corsOrigin, credentials: true });

  // Swagger (solo no-prod)
  if (configService.get<string>('app.nodeEnv') !== 'production') {
    const swaggerCfg = new DocumentBuilder()
      .setTitle('Consorcios Backend API')
      .setDescription('API REST para gestión de consorcios/edificios')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerCfg);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  const port = Number(configService.get('app.port')) || 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
