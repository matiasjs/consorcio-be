import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export enum UnitType {
  APARTMENT = 'APARTMENT',
  STORE = 'STORE',
  GARAGE = 'GARAGE',
  STORAGE = 'STORAGE',
  OFFICE = 'OFFICE',
  HOME = 'HOME',
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
