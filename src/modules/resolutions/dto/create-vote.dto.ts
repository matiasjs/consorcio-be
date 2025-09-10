import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsEnum, IsOptional, IsString } from 'class-validator';

export enum VoteType {
  FOR = 'FOR',
  AGAINST = 'AGAINST',
  ABSTAIN = 'ABSTAIN',
}

export class CreateVoteDto {
  @ApiProperty({ description: 'User ID casting the vote', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'Vote type', enum: VoteType, example: VoteType.FOR })
  @IsNotEmpty()
  @IsEnum(VoteType)
  vote: VoteType;

  @ApiProperty({ description: 'Vote comments', required: false })
  @IsOptional()
  @IsString()
  comments?: string;
}
