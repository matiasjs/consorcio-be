import { IsUUID, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUnitOccupancyDto {
  @ApiProperty({ example: 'uuid-owner-user-id', required: false })
  @IsOptional()
  @IsUUID()
  ownerUserId?: string;

  @ApiProperty({ example: 'uuid-tenant-user-id', required: false })
  @IsOptional()
  @IsUUID()
  tenantUserId?: string;

  @ApiProperty({ example: '2024-01-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2024-12-31', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
