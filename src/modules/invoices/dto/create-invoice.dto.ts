import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsOptional, IsEnum, IsNumber, IsDateString, IsPositive } from 'class-validator';

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

export enum InvoiceType {
  VENDOR = 'VENDOR',
  OWNER = 'OWNER',
  TENANT = 'TENANT',
  OTHER = 'OTHER',
}

export class CreateInvoiceDto {
  @ApiProperty({
    description: 'Invoice number',
    example: 'INV-2024-001',
  })
  @IsNotEmpty()
  @IsString()
  invoiceNumber: string;

  @ApiProperty({
    description: 'Type of invoice',
    enum: InvoiceType,
    example: InvoiceType.VENDOR,
  })
  @IsNotEmpty()
  @IsEnum(InvoiceType)
  type: InvoiceType;

  @ApiProperty({
    description: 'ID of the vendor (if vendor invoice)',
    example: '123e4567-e89b-12d3-a456-426614174001',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  vendorId?: string;

  @ApiProperty({
    description: 'ID of the work order (if related)',
    example: '123e4567-e89b-12d3-a456-426614174002',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  workOrderId?: string;

  @ApiProperty({
    description: 'Invoice description',
    example: 'Plumbing repair services for unit 1A',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Total amount of the invoice',
    example: 1500.00,
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: 'Currency of the invoice',
    example: 'ARS',
  })
  @IsNotEmpty()
  @IsString()
  currency: string;

  @ApiProperty({
    description: 'Tax amount',
    example: 315.00,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  taxAmount?: number;

  @ApiProperty({
    description: 'Tax percentage',
    example: 21.0,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  taxPercentage?: number;

  @ApiProperty({
    description: 'Invoice issue date',
    example: '2024-01-15T00:00:00Z',
  })
  @IsNotEmpty()
  @IsDateString()
  issueDate: string;

  @ApiProperty({
    description: 'Invoice due date',
    example: '2024-02-15T00:00:00Z',
  })
  @IsNotEmpty()
  @IsDateString()
  dueDate: string;

  @ApiProperty({
    description: 'Status of the invoice',
    enum: InvoiceStatus,
    example: InvoiceStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus;

  @ApiProperty({
    description: 'Additional notes',
    example: 'Payment terms: Net 30 days',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Billing address',
    example: 'Av. Corrientes 1234, CABA, Argentina',
    required: false,
  })
  @IsOptional()
  @IsString()
  billingAddress?: string;
}
