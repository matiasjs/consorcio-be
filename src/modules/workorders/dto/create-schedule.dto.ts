import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateScheduleDto {
  @ApiProperty({
    description: 'Scheduled start date and time',
    example: '2024-01-15T09:00:00Z',
  })
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'Scheduled end date and time',
    example: '2024-01-15T17:00:00Z',
  })
  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @ApiProperty({
    description: 'Schedule notes',
    example: 'Coordinate with building manager for access',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
