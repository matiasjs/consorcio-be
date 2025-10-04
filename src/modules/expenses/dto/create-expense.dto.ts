import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
  IsArray,
  ValidateNested,
  IsPositive,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ExpenseDistributionMethod,
  ExpenseItemType,
  ExpenseItemCategory,
} from '../../../entities';

export class CreateExpenseItemDto {
  @ApiProperty({
    description: 'Description of the expense item',
    example: 'Sueldo portero - Enero 2024',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Type of expense item',
    enum: ExpenseItemType,
    example: ExpenseItemType.RECURRING,
  })
  @IsNotEmpty()
  @IsEnum(ExpenseItemType)
  type: ExpenseItemType;

  @ApiProperty({
    description: 'Category of expense item',
    enum: ExpenseItemCategory,
    example: ExpenseItemCategory.STAFF_SALARIES,
  })
  @IsNotEmpty()
  @IsEnum(ExpenseItemCategory)
  category: ExpenseItemCategory;

  @ApiProperty({
    description: 'Amount of the expense item',
    example: 85000.0,
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: 'Currency of the expense item',
    example: 'ARS',
    default: 'ARS',
  })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({
    description: 'Quantity of items',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @ApiProperty({
    description: 'Unit price (if quantity > 1)',
    example: 85000.0,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  unitPrice?: number;

  @ApiProperty({
    description: 'Additional notes',
    example: 'Incluye aguinaldo proporcional',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Related work order ID (for extraordinary expenses)',
    example: '123e4567-e89b-12d3-a456-426614174001',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  relatedWorkOrderId?: string;

  @ApiProperty({
    description: 'Related vendor invoice ID',
    example: '123e4567-e89b-12d3-a456-426614174002',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  relatedVendorInvoiceId?: string;

  @ApiProperty({
    description: 'Service date',
    example: '2024-01-15',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  serviceDate?: string;
}

export class CreateExpenseDto {
  @ApiProperty({
    description: 'Building ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  buildingId: string;

  @ApiProperty({
    description: 'Period in YYYY-MM format',
    example: '2024-01',
  })
  @IsNotEmpty()
  @IsString()
  period: string;

  @ApiProperty({
    description: 'Title of the expense',
    example: 'Expensas Enero 2024',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Description of the expense',
    example: 'Expensas correspondientes al período enero 2024',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Distribution method',
    enum: ExpenseDistributionMethod,
    example: ExpenseDistributionMethod.EQUAL,
    default: ExpenseDistributionMethod.EQUAL,
  })
  @IsOptional()
  @IsEnum(ExpenseDistributionMethod)
  distributionMethod?: ExpenseDistributionMethod;

  @ApiProperty({
    description: 'Due date for payment',
    example: '2024-02-15',
  })
  @IsNotEmpty()
  @IsDateString()
  dueDate: string;

  @ApiProperty({
    description: 'Currency',
    example: 'ARS',
    default: 'ARS',
  })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({
    description: 'Expense items',
    type: [CreateExpenseItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExpenseItemDto)
  items: CreateExpenseItemDto[];
}
