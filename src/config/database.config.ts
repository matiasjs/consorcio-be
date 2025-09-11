import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  // Check if DATABASE_URL is provided (for production environments like Render/Supabase)
  const databaseUrl = configService.get<string>('DATABASE_URL');

  if (databaseUrl) {
    return {
      type: 'postgres',
      url: databaseUrl,
      entities: [join(__dirname, '..', 'entities', '**', '*.entity{.ts,.js}')],
      migrations: [join(__dirname, '..', 'migrations', '*{.ts,.js}')],
      synchronize: configService.get<boolean>('DATABASE_SYNCHRONIZE', false),
      logging: configService.get<boolean>('DATABASE_LOGGING', false),
      ssl: { rejectUnauthorized: false },
      extra: {
        connectionLimit: 10,
        acquireTimeout: 60000,
        timeout: 60000,
      },
    };
  }

  // Fallback to individual connection parameters
  return {
    type: 'postgres',
    host: configService.get<string>('DATABASE_HOST', 'localhost'),
    port: configService.get<number>('DATABASE_PORT', 5432),
    username: configService.get<string>('DATABASE_USERNAME', 'postgres'),
    password: configService.get<string>('DATABASE_PASSWORD', 'postgres123'),
    database: configService.get<string>('DATABASE_NAME', 'consorcios_db'),
    entities: [join(__dirname, '..', 'entities', '**', '*.entity{.ts,.js}')],
    migrations: [join(__dirname, '..', 'migrations', '*{.ts,.js}')],
    synchronize: configService.get<boolean>('DATABASE_SYNCHRONIZE', true),
    logging: configService.get<boolean>('DATABASE_LOGGING', true),
    ssl: configService.get<string>('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
    extra: {
      connectionLimit: 10,
      acquireTimeout: 60000,
      timeout: 60000,
    },
  };
};

// DataSource for migrations
const getDataSourceOptions = (): DataSourceOptions => {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl) {
    return {
      type: 'postgres',
      url: databaseUrl,
      entities: [join(__dirname, '..', 'entities', '**', '*.entity{.ts,.js}')],
      migrations: [join(__dirname, '..', 'migrations', '*{.ts,.js}')],
      synchronize: false,
      logging: process.env.DATABASE_LOGGING === 'true',
      ssl: { rejectUnauthorized: false },
      extra: {
        connectionLimit: 10,
        acquireTimeout: 60000,
        timeout: 60000,
      },
    };
  }

  return {
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres123',
    database: process.env.DATABASE_NAME || 'consorcios_db',
    entities: [join(__dirname, '..', 'entities', '**', '*.entity{.ts,.js}')],
    migrations: [join(__dirname, '..', 'migrations', '*{.ts,.js}')],
    synchronize: false,
    logging: process.env.DATABASE_LOGGING === 'true',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    extra: {
      connectionLimit: 10,
      acquireTimeout: 60000,
      timeout: 60000,
    },
  };
};

export default new DataSource(getDataSourceOptions());
