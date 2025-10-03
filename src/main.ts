// Web Crypto en Node (solo si falta)
import { webcrypto as nodeCrypto } from 'node:crypto';
globalThis.crypto ??= nodeCrypto as unknown as Crypto;

import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

function parseCorsOrigins(input?: string | string[]): string[] {
  if (!input) return ['http://localhost:3000'];

  // If it's already an array (from config), clean it up
  if (Array.isArray(input)) {
    return input.map((s) => s.trim()).filter(Boolean);
  }

  // If it's a string, split and clean
  return input
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

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

  // CORS configuration
  app.enableCors({
    origin: process.env.NODE_ENV === 'local' ? true : process.env.CORS_ORIGIN?.split(','),
    methods: 'GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS',
    allowedHeaders: 'Authorization,Content-Type,Accept',
    credentials: true,
  });

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
