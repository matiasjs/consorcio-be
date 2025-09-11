import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
} from 'class-validator';

export enum WorkOrderStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum WorkOrderPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export class CreateWorkOrderDto {
  @ApiProperty({
    description: 'ID of the related ticket',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  ticketId: string;

  @ApiProperty({
    description: 'ID of the assigned vendor',
    example: '123e4567-e89b-12d3-a456-426614174001',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  vendorId?: string;

  @ApiProperty({
    description: 'Title of the work order',
    example: 'Repair water leak in unit 1A',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Detailed description of the work to be done',
    example: 'Replace damaged pipe section and repair surrounding wall damage',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Priority level of the work order',
    enum: WorkOrderPriority,
    example: WorkOrderPriority.HIGH,
  })
  @IsNotEmpty()
  @IsEnum(WorkOrderPriority)
  priority: WorkOrderPriority;

  @ApiProperty({
    description: 'Status of the work order',
    enum: WorkOrderStatus,
    example: WorkOrderStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(WorkOrderStatus)
  status?: WorkOrderStatus;

  @ApiProperty({
    description: 'Estimated cost of the work',
    example: 1500.0,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  estimatedCost?: number;

  @ApiProperty({
    description: 'Actual cost of the work',
    example: 1650.0,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  actualCost?: number;

  @ApiProperty({
    description: 'Scheduled start date',
    example: '2024-01-15T09:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  scheduledStartDate?: string;

  @ApiProperty({
    description: 'Scheduled completion date',
    example: '2024-01-16T17:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  scheduledCompletionDate?: string;

  @ApiProperty({
    description: 'Additional notes',
    example: 'Access required between 9 AM and 5 PM',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
