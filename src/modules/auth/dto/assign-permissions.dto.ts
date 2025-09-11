import { IsArray, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AssignPermissionsDto {
  @ApiPropertyOptional({ 
    description: 'Permission codes to add', 
    example: ['allUsers', 'manageBuildings'],
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  add?: string[];

  @ApiPropertyOptional({ 
    description: 'Permission codes to remove', 
    example: ['readUsers'],
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  remove?: string[];
}
