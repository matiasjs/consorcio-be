import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class CreateQuoteDto {
  @ApiProperty({
    description: 'ID of the vendor providing the quote',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsNotEmpty()
  @IsUUID()
  vendorId: string;

  @ApiProperty({
    description: 'Quote amount',
    example: 1500.0,
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;

  @ApiProperty({
    description: 'Currency of the quote',
    example: 'ARS',
  })
  @IsNotEmpty()
  @IsString()
  currency: string;

  @ApiProperty({
    description: 'Description of the quote',
    example: 'Complete pipe replacement including materials and labor',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Quote validity date',
    example: '2024-02-15T23:59:59Z',
  })
  @IsNotEmpty()
  @IsDateString()
  validUntil: string;

  @ApiProperty({
    description: 'Additional notes',
    example: 'Price includes 6-month warranty',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
