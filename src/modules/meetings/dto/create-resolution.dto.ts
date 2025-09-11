import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';

export enum ResolutionStatus {
  PROPOSED = 'PROPOSED',
  VOTING = 'VOTING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

export class CreateResolutionDto {
  @ApiProperty({
    description: 'Resolution title',
    example: 'Approve building maintenance budget',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Resolution description',
    example: 'Approve the annual maintenance budget of $50,000',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Resolution status',
    enum: ResolutionStatus,
    example: ResolutionStatus.PROPOSED,
  })
  @IsOptional()
  @IsEnum(ResolutionStatus)
  status?: ResolutionStatus;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
