import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PlanTier } from '../../../entities/administration.entity';

export class CreateAdministrationDto {
  @ApiProperty({
    description: 'Administration name',
    example: 'Administración Central',
  })
  @IsString()
  @Length(2, 255)
  name: string;

  @ApiProperty({
    description: 'CUIT number',
    example: '20-12345678-9',
  })
  @IsString()
  @Matches(/^\d{2}-\d{8}-\d{1}$/, {
    message: 'CUIT must be in format XX-XXXXXXXX-X',
  })
  cuit: string;

  @ApiProperty({
    description: 'Email address',
    example: 'admin@administracion.com',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'Phone number',
    example: '+54 11 1234-5678',
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  phone?: string;

  @ApiPropertyOptional({
    description: 'Address',
    example: 'Av. Corrientes 1234, CABA',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'Plan tier',
    enum: PlanTier,
    example: PlanTier.BASIC,
  })
  @IsOptional()
  @IsEnum(PlanTier)
  planTier?: PlanTier;
}
