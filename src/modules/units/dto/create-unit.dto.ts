import {
  IsString,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum UnitType {
  APARTMENT = 'apartment',
  STORE = 'store',
  GARAGE = 'garage',
}

export class CreateUnitDto {
  @ApiProperty({ example: 'uuid-building-id' })
  @IsUUID()
  buildingId: string;

  @ApiProperty({ example: '4A' })
  @IsString()
  label: string;

  @ApiProperty({ example: 'apartment', enum: UnitType })
  @IsEnum(UnitType)
  type: UnitType;

  @ApiProperty({ example: 4 })
  @IsNumber()
  floor: number;

  @ApiProperty({ example: 85.5 })
  @IsNumber()
  m2: number;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isRented?: boolean;
}
