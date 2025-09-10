import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsPositive } from 'class-validator';

export class CreateMaterialDto {
  @ApiProperty({
    description: 'Name of the material',
    example: 'PVC Pipe 1/2 inch',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description of the material',
    example: 'High-quality PVC pipe suitable for plumbing applications',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Category of the material',
    example: 'Plumbing',
  })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({
    description: 'Unit of measurement',
    example: 'meter',
  })
  @IsNotEmpty()
  @IsString()
  unit: string;

  @ApiProperty({
    description: 'Unit cost of the material',
    example: 25.50,
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  unitCost: number;

  @ApiProperty({
    description: 'Currency of the unit cost',
    example: 'ARS',
  })
  @IsNotEmpty()
  @IsString()
  currency: string;

  @ApiProperty({
    description: 'Current stock quantity',
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  stockQuantity?: number;

  @ApiProperty({
    description: 'Minimum stock level for alerts',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  minStockLevel?: number;

  @ApiProperty({
    description: 'Supplier information',
    example: 'ABC Materials Supply',
    required: false,
  })
  @IsOptional()
  @IsString()
  supplier?: string;

  @ApiProperty({
    description: 'SKU or product code',
    example: 'PVC-PIPE-12-001',
    required: false,
  })
  @IsOptional()
  @IsString()
  sku?: string;
}
