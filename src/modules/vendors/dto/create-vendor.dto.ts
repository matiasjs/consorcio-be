import {
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVendorDto {
  @ApiProperty({ example: 'Plomería Rodríguez S.A.' })
  @IsString()
  legalName: string;

  @ApiProperty({ example: 'plumbing' })
  @IsString()
  trade: string;

  @ApiProperty({ example: 'contacto@plomeriarodriguez.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+5491123456789' })
  @IsString()
  phone: string;

  @ApiProperty({ example: '+5491123456789', required: false })
  @IsOptional()
  @IsString()
  whatsapp?: string;

  @ApiProperty({ example: 4.5, minimum: 0, maximum: 5, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  ratingAvg?: number;
}
