import {
  IsString,
  IsEnum,
  IsOptional,
  IsUUID,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  EntityType,
  MessageDirection,
  MessageChannel,
} from '../../../entities/message.entity';

class AttachmentDto {
  @ApiProperty()
  @IsString()
  filename: string;

  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty()
  @IsString()
  mimeType: string;

  @ApiProperty()
  size: number;
}

export class CreateMessageDto {
  @ApiProperty({ enum: EntityType })
  @IsEnum(EntityType)
  entityType: EntityType;

  @ApiProperty()
  @IsUUID()
  entityId: string;

  @ApiProperty({ enum: MessageDirection })
  @IsEnum(MessageDirection)
  direction: MessageDirection;

  @ApiProperty({ enum: MessageChannel })
  @IsEnum(MessageChannel)
  channel: MessageChannel;

  @ApiProperty()
  @IsString()
  body: string;

  @ApiPropertyOptional({ type: [AttachmentDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fromEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  toEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fromPhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  toPhone?: string;
}
