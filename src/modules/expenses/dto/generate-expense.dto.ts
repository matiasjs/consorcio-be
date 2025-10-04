import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { ExpenseDistributionMethod } from '../../../entities';

export class GenerateExpenseDto {
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
    description: 'Include recurring expenses (staff, insurance, etc.)',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  includeRecurring?: boolean;

  @ApiProperty({
    description: 'Include common expenses (utilities, cleaning, etc.)',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  includeCommon?: boolean;

  @ApiProperty({
    description: 'Include extraordinary expenses from work orders',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  includeExtraordinary?: boolean;

  @ApiProperty({
    description: 'Force regeneration if expense already exists',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  forceRegenerate?: boolean;

  @ApiProperty({
    description: 'Custom title for the expense',
    example: 'Expensas Enero 2024',
    required: false,
  })
  @IsOptional()
  @IsString()
  customTitle?: string;

  @ApiProperty({
    description: 'Additional description',
    example: 'Incluye gastos extraordinarios por reparación de ascensor',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
