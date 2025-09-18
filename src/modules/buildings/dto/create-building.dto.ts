import {
  IsString,
  IsOptional,
  IsNumber,
  IsInt,
  Min,
  Max,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateBuildingDto {
  @ApiProperty({
    description: 'Building name',
    example: 'Torre Central',
  })
  @IsString()
  @Length(2, 255)
  name: string;

  @ApiProperty({
    description: 'Building address',
    example: 'Av. Santa Fe 1234',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'City',
    example: 'Buenos Aires',
  })
  @IsString()
  @Length(2, 100)
  city: string;

  @ApiPropertyOptional({
    description: 'Country',
    example: 'Argentina',
    default: 'Argentina',
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  country?: string;

  @ApiPropertyOptional({
    description: 'Additional notes',
    example: 'Building with 24/7 security',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'ZIP code',
    example: '1425',
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  zipCode?: string;

  @ApiPropertyOptional({
    description: 'Latitude coordinate',
    example: -34.603722,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 8 })
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ApiPropertyOptional({
    description: 'Longitude coordinate',
    example: -58.381592,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 8 })
  @Min(-180)
  @Max(180)
  longitude?: number;

  @ApiPropertyOptional({
    description: 'Total number of floors',
    example: 15,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  totalFloors?: number;

  @ApiPropertyOptional({
    description: 'Total number of units',
    example: 60,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  totalUnits?: number;
}
