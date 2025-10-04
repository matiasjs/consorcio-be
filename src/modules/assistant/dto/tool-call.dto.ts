import { IsString, IsObject, IsOptional, IsEnum, IsNumber, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum ToolType {
  FIND = 'find',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  RUN_WORKFLOW = 'runWorkflow',
}

export class FindToolDto {
  @ApiProperty({ description: 'Entity name to query' })
  @IsString()
  entity: string;

  @ApiProperty({ description: 'Where conditions', required: false })
  @IsOptional()
  @IsObject()
  where?: Record<string, any>;

  @ApiProperty({ description: 'Fields to select', required: false })
  @IsOptional()
  select?: string[];

  @ApiProperty({ description: 'Order by fields', required: false })
  @IsOptional()
  @IsObject()
  orderBy?: Record<string, 'ASC' | 'DESC'>;

  @ApiProperty({ description: 'Limit results', required: false })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiProperty({ description: 'Page number', required: false })
  @IsOptional()
  @IsNumber()
  page?: number;
}

export class CreateToolDto {
  @ApiProperty({ description: 'Entity name to create' })
  @IsString()
  entity: string;

  @ApiProperty({ description: 'Data to create' })
  @IsObject()
  data: Record<string, any>;
}

export class UpdateToolDto {
  @ApiProperty({ description: 'Entity name to update' })
  @IsString()
  entity: string;

  @ApiProperty({ description: 'Where conditions to find records to update' })
  @IsObject()
  where: Record<string, any>;

  @ApiProperty({ description: 'Data to update' })
  @IsObject()
  data: Record<string, any>;
}

export class DeleteToolDto {
  @ApiProperty({ description: 'Entity name to delete from' })
  @IsString()
  entity: string;

  @ApiProperty({ description: 'Where conditions to find records to delete' })
  @IsObject()
  where: Record<string, any>;

  @ApiProperty({ description: 'Whether to perform hard delete', required: false })
  @IsOptional()
  hardDelete?: boolean;
}

export class RunWorkflowToolDto {
  @ApiProperty({ description: 'Workflow name to execute' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Arguments for the workflow', required: false })
  @IsOptional()
  @IsObject()
  args?: Record<string, any>;
}

export class ToolCallDto {
  @ApiProperty({ enum: ToolType, description: 'Type of tool to execute' })
  @IsEnum(ToolType)
  type: ToolType;

  @ApiProperty({ description: 'Tool parameters' })
  @IsObject()
  parameters: FindToolDto | CreateToolDto | UpdateToolDto | DeleteToolDto | RunWorkflowToolDto;

  @ApiProperty({ description: 'Idempotency key for the operation', required: false })
  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}

export class ToolExecutionDto {
  @ApiProperty({ description: 'Tool call to execute' })
  @ValidateNested()
  @Type(() => ToolCallDto)
  toolCall: ToolCallDto;

  @ApiProperty({ description: 'Execution mode', enum: ['dry-run', 'apply'] })
  @IsEnum(['dry-run', 'apply'])
  mode: 'dry-run' | 'apply';

  @ApiProperty({ description: 'Idempotency key for the execution', required: false })
  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}

export class ToolResultDto {
  @ApiProperty({ description: 'Whether the operation was successful' })
  success: boolean;

  @ApiProperty({ description: 'Result data', required: false })
  data?: any;

  @ApiProperty({ description: 'Error message if operation failed', required: false })
  error?: string;

  @ApiProperty({ description: 'Explanation of what was attempted', required: false })
  explain?: {
    operation: string;
    entity: string;
    fieldsMapping?: Record<string, string>;
    constraints?: string[];
    affectedRecords?: number;
  };

  @ApiProperty({ description: 'Execution mode used' })
  mode: 'dry-run' | 'apply';

  @ApiProperty({ description: 'Execution timestamp' })
  executedAt: string;

  @ApiProperty({ description: 'Idempotency key used', required: false })
  idempotencyKey?: string;
}
