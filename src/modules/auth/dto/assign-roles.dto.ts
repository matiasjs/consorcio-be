import { IsArray, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AssignRolesDto {
  @ApiPropertyOptional({
    description: 'Role names to add',
    example: ['admin', 'secretaria'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  add?: string[];

  @ApiPropertyOptional({
    description: 'Role names to remove',
    example: ['owner'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  remove?: string[];
}
