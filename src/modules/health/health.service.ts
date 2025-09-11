import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

@Injectable()
export class HealthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  async check() {
    const startTime = Date.now();
    
    // Check database connection
    let databaseStatus = 'disconnected';
    try {
      await this.dataSource.query('SELECT 1');
      databaseStatus = 'connected';
    } catch (error) {
      console.error('Database health check failed:', error);
      databaseStatus = 'error';
    }

    const responseTime = Date.now() - startTime;

    return {
      status: databaseStatus === 'connected' ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: this.configService.get<string>('app.nodeEnv'),
      version: process.env.npm_package_version || '1.0.0',
      database: databaseStatus,
      responseTime: `${responseTime}ms`,
    };
  }
}
