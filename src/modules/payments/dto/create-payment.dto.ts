import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
  IsPositive,
} from 'class-validator';

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  CHECK = 'CHECK',
  DIGITAL_WALLET = 'DIGITAL_WALLET',
  OTHER = 'OTHER',
}

export enum PaymentType {
  INVOICE_PAYMENT = 'INVOICE_PAYMENT',
  EXPENSE_PAYMENT = 'EXPENSE_PAYMENT',
  REFUND = 'REFUND',
  ADVANCE = 'ADVANCE',
  OTHER = 'OTHER',
}

export class CreatePaymentDto {
  @ApiProperty({
    description: 'Payment reference number',
    example: 'PAY-2024-001',
  })
  @IsNotEmpty()
  @IsString()
  referenceNumber: string;

  @ApiProperty({
    description: 'Type of payment',
    enum: PaymentType,
    example: PaymentType.INVOICE_PAYMENT,
  })
  @IsNotEmpty()
  @IsEnum(PaymentType)
  type: PaymentType;

  @ApiProperty({
    description: 'ID of the related invoice (if applicable)',
    example: '123e4567-e89b-12d3-a456-426614174001',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  invoiceId?: string;

  @ApiProperty({
    description: 'ID of the vendor receiving payment (if applicable)',
    example: '123e4567-e89b-12d3-a456-426614174002',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  vendorId?: string;

  @ApiProperty({
    description: 'Payment amount',
    example: 1500.0,
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: 'Currency of the payment',
    example: 'ARS',
  })
  @IsNotEmpty()
  @IsString()
  currency: string;

  @ApiProperty({
    description: 'Payment method used',
    enum: PaymentMethod,
    example: PaymentMethod.BANK_TRANSFER,
  })
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiProperty({
    description: 'Payment status',
    enum: PaymentStatus,
    example: PaymentStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiProperty({
    description: 'Payment date',
    example: '2024-01-15T10:30:00Z',
  })
  @IsNotEmpty()
  @IsDateString()
  paymentDate: string;

  @ApiProperty({
    description: 'Payment description',
    example: 'Payment for plumbing repair services',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Transaction ID from payment processor',
    example: 'TXN-ABC123456',
    required: false,
  })
  @IsOptional()
  @IsString()
  transactionId?: string;

  @ApiProperty({
    description: 'Additional notes',
    example: 'Payment processed via bank transfer',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Payer information',
    example: 'Consorcio Building ABC',
    required: false,
  })
  @IsOptional()
  @IsString()
  payer?: string;

  @ApiProperty({
    description: 'Payee information',
    example: 'XYZ Plumbing Services',
    required: false,
  })
  @IsOptional()
  @IsString()
  payee?: string;
}
