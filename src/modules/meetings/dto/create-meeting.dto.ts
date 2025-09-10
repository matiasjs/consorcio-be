import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsOptional, IsEnum, IsDateString } from 'class-validator';

export enum MeetingType {
  ORDINARY = 'ORDINARY',
  EXTRAORDINARY = 'EXTRAORDINARY',
  BOARD = 'BOARD',
  COMMITTEE = 'COMMITTEE',
}

export enum MeetingStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  POSTPONED = 'POSTPONED',
}

export class CreateMeetingDto {
  @ApiProperty({ description: 'Meeting title', example: 'Monthly Consortium Meeting' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Meeting description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Meeting type', enum: MeetingType, example: MeetingType.ORDINARY })
  @IsNotEmpty()
  @IsEnum(MeetingType)
  type: MeetingType;

  @ApiProperty({ description: 'Building ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsUUID()
  buildingId: string;

  @ApiProperty({ description: 'Meeting date and time', example: '2024-02-15T19:00:00Z' })
  @IsNotEmpty()
  @IsDateString()
  scheduledDate: string;

  @ApiProperty({ description: 'Meeting location', example: 'Building A - Community Room' })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({ description: 'Meeting agenda', required: false })
  @IsOptional()
  @IsString()
  agenda?: string;

  @ApiProperty({ description: 'Meeting status', enum: MeetingStatus, example: MeetingStatus.SCHEDULED })
  @IsOptional()
  @IsEnum(MeetingStatus)
  status?: MeetingStatus;

  @ApiProperty({ description: 'Meeting notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
