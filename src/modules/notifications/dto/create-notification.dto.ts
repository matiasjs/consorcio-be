import {
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum NotificationType {
  TICKET_CREATED = 'TICKET_CREATED',
  TICKET_UPDATED = 'TICKET_UPDATED',
  INSPECTION_SCHEDULED = 'INSPECTION_SCHEDULED',
  WORKORDER_ASSIGNED = 'WORKORDER_ASSIGNED',
  PAYMENT_DUE = 'PAYMENT_DUE',
  MEETING_SCHEDULED = 'MEETING_SCHEDULED',
  SYSTEM_ALERT = 'SYSTEM_ALERT',
  GENERAL = 'GENERAL',
}

export class CreateNotificationDto {
  @ApiProperty({
    description: 'Notification title',
    example: 'New ticket created',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Notification message',
    example: 'A new ticket has been created for your unit',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Notification type',
    enum: NotificationType,
    example: NotificationType.TICKET_CREATED,
  })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiPropertyOptional({
    description: 'Target user ID',
    example: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  targetUserId?: string;

  @ApiPropertyOptional({
    description: 'Target building ID',
    example: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  targetBuildingId?: string;

  @ApiPropertyOptional({
    description: 'Related entity ID',
    example: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  relatedEntityId?: string;

  @ApiPropertyOptional({
    description: 'Related entity type',
    example: 'ticket',
  })
  @IsOptional()
  @IsString()
  relatedEntityType?: string;

  @ApiPropertyOptional({
    description: 'Action URL',
    example: '/tickets/123',
  })
  @IsOptional()
  @IsString()
  actionUrl?: string;

  @ApiPropertyOptional({
    description: 'Is high priority',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isHighPriority?: boolean;
}
