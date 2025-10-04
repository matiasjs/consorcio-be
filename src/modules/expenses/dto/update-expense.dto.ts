import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsOptional,
  IsEnum,
  IsDateString,
  IsString,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { CreateExpenseDto } from './create-expense.dto';
import { ExpenseStatus, ExpenseDistributionMethod } from '../../../entities';

export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {
  @ApiProperty({
    description: 'Status of the expense',
    enum: ExpenseStatus,
    example: ExpenseStatus.GENERATED,
    required: false,
  })
  @IsOptional()
  @IsEnum(ExpenseStatus)
  status?: ExpenseStatus;

  @ApiProperty({
    description: 'Total amount (calculated automatically)',
    example: 125000.0,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  totalAmount?: number;

  @ApiProperty({
    description: 'Date when expense was generated',
    example: '2024-01-15T10:30:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  generatedAt?: string;

  @ApiProperty({
    description: 'Date when expense was sent to owners',
    example: '2024-01-16T09:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  sentAt?: string;
}

export class UpdateExpenseDistributionDto {
  @ApiProperty({
    description: 'Payment amount',
    example: 8500.0,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  paidAmount?: number;

  @ApiProperty({
    description: 'Payment reference',
    example: 'TRANSFER-20240115-001',
    required: false,
  })
  @IsOptional()
  @IsString()
  paymentReference?: string;

  @ApiProperty({
    description: 'Payment date',
    example: '2024-01-15',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  paidAt?: string;

  @ApiProperty({
    description: 'Additional notes',
    example: 'Pago parcial - resta $2000',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
