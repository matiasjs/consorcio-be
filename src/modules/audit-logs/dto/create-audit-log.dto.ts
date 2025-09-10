import { IsString, IsUUID, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum AuditAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  ASSIGN = 'ASSIGN',
  COMPLETE = 'COMPLETE',
  CANCEL = 'CANCEL',
}

export enum AuditEntityType {
  USER = 'USER',
  BUILDING = 'BUILDING',
  UNIT = 'UNIT',
  TICKET = 'TICKET',
  INSPECTION = 'INSPECTION',
  WORKORDER = 'WORKORDER',
  INVOICE = 'INVOICE',
  PAYMENT = 'PAYMENT',
  DOCUMENT = 'DOCUMENT',
  MEETING = 'MEETING',
  ASSET = 'ASSET',
  VENDOR = 'VENDOR',
  MATERIAL = 'MATERIAL',
  NOTIFICATION = 'NOTIFICATION',
  SUBSCRIPTION = 'SUBSCRIPTION',
  SYSTEM = 'SYSTEM',
}

export class CreateAuditLogDto {
  @ApiProperty({
    description: 'Action performed',
    enum: AuditAction,
    example: AuditAction.CREATE,
  })
  @IsEnum(AuditAction)
  action: AuditAction;

  @ApiProperty({
    description: 'Entity type',
    enum: AuditEntityType,
    example: AuditEntityType.TICKET,
  })
  @IsEnum(AuditEntityType)
  entityType: AuditEntityType;

  @ApiPropertyOptional({
    description: 'Entity ID',
    example: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  entityId?: string;

  @ApiPropertyOptional({
    description: 'User ID who performed the action',
    example: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({
    description: 'Description of the action',
    example: 'Created new ticket for plumbing issue',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Old values before change',
    example: { status: 'OPEN' },
  })
  @IsOptional()
  oldValues?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'New values after change',
    example: { status: 'IN_PROGRESS' },
  })
  @IsOptional()
  newValues?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'IP address',
    example: '192.168.1.1',
  })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiPropertyOptional({
    description: 'User agent',
    example: 'Mozilla/5.0...',
  })
  @IsOptional()
  @IsString()
  userAgent?: string;

  @ApiPropertyOptional({
    description: 'Additional metadata',
    example: { module: 'tickets', feature: 'create' },
  })
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Timestamp of the action',
    example: '2024-01-01T10:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  timestamp?: string;
}
