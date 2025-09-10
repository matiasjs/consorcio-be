import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsOptional, IsEnum, IsDateString } from 'class-validator';

export enum InspectionStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class CreateInspectionDto {
  @ApiProperty({
    description: 'ID of the ticket being inspected',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  ticketId: string;

  @ApiProperty({
    description: 'ID of the inspector user',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsNotEmpty()
  @IsUUID()
  inspectorId: string;

  @ApiProperty({
    description: 'Scheduled date and time for the inspection',
    example: '2024-01-15T10:00:00Z',
  })
  @IsNotEmpty()
  @IsDateString()
  scheduledAt: string;

  @ApiProperty({
    description: 'Status of the inspection',
    enum: InspectionStatus,
    example: InspectionStatus.SCHEDULED,
  })
  @IsOptional()
  @IsEnum(InspectionStatus)
  status?: InspectionStatus;

  @ApiProperty({
    description: 'Notes about the inspection',
    example: 'Initial inspection to assess water damage',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Findings from the inspection',
    example: 'Minor leak detected in bathroom pipe',
    required: false,
  })
  @IsOptional()
  @IsString()
  findings?: string;

  @ApiProperty({
    description: 'Recommendations from the inspector',
    example: 'Replace pipe section and check surrounding area',
    required: false,
  })
  @IsOptional()
  @IsString()
  recommendations?: string;
}
