import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
} from 'class-validator';

export enum AssetStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  RETIRED = 'RETIRED',
}

export class CreateAssetDto {
  @ApiProperty({ description: 'Asset name', example: 'Elevator A' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Asset description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Asset category', example: 'Elevator' })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({
    description: 'Asset location',
    example: 'Building A - Floor 1',
  })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({
    description: 'Building ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  buildingId: string;

  @ApiProperty({
    description: 'Asset status',
    enum: AssetStatus,
    example: AssetStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(AssetStatus)
  status?: AssetStatus;

  @ApiProperty({
    description: 'Purchase date',
    example: '2020-01-15T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  purchaseDate?: string;

  @ApiProperty({
    description: 'Purchase cost',
    example: 50000.0,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  purchaseCost?: number;

  @ApiProperty({ description: 'Warranty expiry date', required: false })
  @IsOptional()
  @IsDateString()
  warrantyExpiryDate?: string;

  @ApiProperty({
    description: 'Manufacturer',
    example: 'OTIS',
    required: false,
  })
  @IsOptional()
  @IsString()
  manufacturer?: string;

  @ApiProperty({
    description: 'Model number',
    example: 'GEN2-MR',
    required: false,
  })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({
    description: 'Serial number',
    example: 'SN123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  serialNumber?: string;
}
