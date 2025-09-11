import {
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum MetricType {
  LOGIN = 'LOGIN',
  TICKET_CREATED = 'TICKET_CREATED',
  INSPECTION_COMPLETED = 'INSPECTION_COMPLETED',
  PAYMENT_PROCESSED = 'PAYMENT_PROCESSED',
  DOCUMENT_UPLOADED = 'DOCUMENT_UPLOADED',
  API_CALL = 'API_CALL',
  FEATURE_USAGE = 'FEATURE_USAGE',
  SYSTEM_EVENT = 'SYSTEM_EVENT',
}

export class CreateUsageMetricDto {
  @ApiProperty({
    description: 'Metric type',
    enum: MetricType,
    example: MetricType.LOGIN,
  })
  @IsEnum(MetricType)
  type: MetricType;

  @ApiProperty({
    description: 'Metric name',
    example: 'user_login',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'User ID',
    example: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({
    description: 'Building ID',
    example: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  buildingId?: string;

  @ApiPropertyOptional({
    description: 'Metric value',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  value?: number;

  @ApiPropertyOptional({
    description: 'Metric unit',
    example: 'count',
  })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({
    description: 'Additional metadata',
    example: { browser: 'Chrome', ip: '192.168.1.1' },
  })
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Event timestamp',
    example: '2024-01-01T10:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  timestamp?: string;

  @ApiPropertyOptional({
    description: 'Session ID',
    example: 'session-123',
  })
  @IsOptional()
  @IsString()
  sessionId?: string;

  @ApiPropertyOptional({
    description: 'Source',
    example: 'web_app',
  })
  @IsOptional()
  @IsString()
  source?: string;
}
