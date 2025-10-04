import { IsString, IsArray, IsOptional, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ChatMessage {
  @ApiProperty({ description: 'Message role', enum: ['user', 'assistant', 'system'] })
  @IsString()
  role: 'user' | 'assistant' | 'system';

  @ApiProperty({ description: 'Message content' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'Message timestamp', required: false })
  @IsOptional()
  @IsString()
  timestamp?: string;

  @ApiProperty({ description: 'Tool calls in this message', required: false })
  @IsOptional()
  @IsArray()
  tool_calls?: any[];
}

export class AssistantContext {
  @ApiProperty({ description: 'Current tenant/administration ID', required: false })
  @IsOptional()
  @IsString()
  tenantId?: string;

  @ApiProperty({ description: 'User ID making the request', required: false })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ description: 'User roles', required: false })
  @IsOptional()
  @IsArray()
  userRoles?: string[];

  @ApiProperty({ description: 'Additional context data', required: false })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class AssistantRequestDto {
  @ApiProperty({ description: 'Chat message history', type: [ChatMessage] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatMessage)
  messages: ChatMessage[];

  @ApiProperty({ description: 'Current message from user' })
  @IsString()
  message: string;

  @ApiProperty({ description: 'Context information', required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => AssistantContext)
  context?: AssistantContext;

  @ApiProperty({ description: 'Whether to include entity catalog in context', required: false })
  @IsOptional()
  includeCatalog?: boolean;
}

export class AssistantResponseDto {
  @ApiProperty({ description: 'Assistant response message' })
  message: string;

  @ApiProperty({ description: 'Proposed tool calls', required: false })
  toolCalls?: any[];

  @ApiProperty({ description: 'Response timestamp' })
  timestamp: string;

  @ApiProperty({ description: 'Whether the response is complete' })
  finished: boolean;

  @ApiProperty({ description: 'Usage statistics', required: false })
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
