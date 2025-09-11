import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
} from 'class-validator';

export enum MaintenanceFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  SEMI_ANNUALLY = 'SEMI_ANNUALLY',
  ANNUALLY = 'ANNUALLY',
}

export class CreateMaintenancePlanDto {
  @ApiProperty({
    description: 'Plan name',
    example: 'Elevator Monthly Inspection',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Plan description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Maintenance frequency',
    enum: MaintenanceFrequency,
  })
  @IsNotEmpty()
  @IsEnum(MaintenanceFrequency)
  frequency: MaintenanceFrequency;

  @ApiProperty({ description: 'Estimated duration in hours', example: 2 })
  @IsNotEmpty()
  @IsNumber()
  estimatedDuration: number;

  @ApiProperty({ description: 'Instructions for maintenance', required: false })
  @IsOptional()
  @IsString()
  instructions?: string;
}
