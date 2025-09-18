import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
} from 'class-validator';

export enum DocumentType {
  CONTRACT = 'CONTRACT',
  INVOICE = 'INVOICE',
  RECEIPT = 'RECEIPT',
  REPORT = 'REPORT',
  CERTIFICATE = 'CERTIFICATE',
  REGULATION = 'REGULATION',
  MEETING_MINUTES = 'MEETING_MINUTES',
  OTHER = 'OTHER',
}

export enum DocumentStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  EXPIRED = 'EXPIRED',
}

export class CreateDocumentDto {
  @ApiProperty({
    description: 'Document title',
    example: 'Building Maintenance Contract 2024',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Document description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Document type',
    enum: DocumentType,
    example: DocumentType.CONTRACT,
  })
  @IsNotEmpty()
  @IsEnum(DocumentType)
  type: DocumentType;

  @ApiProperty({
    description: 'Building ID (if related to specific building)',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  buildingId?: string;

  @ApiProperty({
    description: 'File path or URL',
    example: '/documents/contracts/maintenance-2024.pdf',
  })
  @IsNotEmpty()
  @IsString()
  filePath: string;

  @ApiProperty({
    description: 'File name',
    example: 'maintenance-contract-2024.pdf',
  })
  @IsNotEmpty()
  @IsString()
  fileName: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 1024000,
    required: false,
  })
  @IsOptional()
  fileSize?: number;

  @ApiProperty({
    description: 'MIME type',
    example: 'application/pdf',
    required: false,
  })
  @IsOptional()
  @IsString()
  mimeType?: string;

  @ApiProperty({
    description: 'Document status',
    enum: DocumentStatus,
    example: DocumentStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;

  @ApiProperty({
    description: 'Document category',
    example: 'Legal',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    description: 'Document tags (comma-separated)',
    example: 'contract,maintenance,2024',
    required: false,
  })
  @IsOptional()
  @IsString()
  tags?: string;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
