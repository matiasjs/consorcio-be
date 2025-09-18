import {
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export enum SubscriptionType {
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE',
  TRIAL = 'TRIAL',
}

export class CreateSubscriptionDto {
  @ApiProperty({
    description: 'Subscription type',
    enum: SubscriptionType,
    example: SubscriptionType.BASIC,
  })
  @IsEnum(SubscriptionType)
  type: SubscriptionType;

  @ApiProperty({
    description: 'Subscription name',
    example: 'Basic Plan',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Subscription description',
    example: 'Basic features for small buildings',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Monthly price',
    example: 99.99,
  })
  @IsNumber()
  monthlyPrice: number;

  @ApiProperty({
    description: 'Currency',
    example: 'ARS',
  })
  @IsString()
  currency: string;

  @ApiProperty({
    description: 'Start date',
    example: '2024-01-01',
  })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({
    description: 'End date',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Max buildings allowed',
    example: 5,
  })
  @IsOptional()
  @IsNumber()
  maxBuildings?: number;

  @ApiPropertyOptional({
    description: 'Max users allowed',
    example: 50,
  })
  @IsOptional()
  @IsNumber()
  maxUsers?: number;

  @ApiPropertyOptional({
    description: 'Features included',
    example: ['tickets', 'inspections', 'basic_reports'],
  })
  @IsOptional()
  features?: string[];

  @ApiPropertyOptional({
    description: 'Notes',
    example: 'Special discount applied',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
