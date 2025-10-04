import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../../../entities/audit-log.entity';
import { AssistantRequestDto, AssistantResponseDto } from '../dto/assistant.dto';
import { ToolResultDto } from '../dto/tool-call.dto';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async logAssistantRequest(
    request: AssistantRequestDto,
    userContext: any
  ): Promise<void> {
    try {
      const auditLog = this.auditLogRepository.create({
        adminId: userContext.adminId,
        userId: userContext.userId,
        action: 'assistant_request',
        entityType: 'Assistant',
        entityId: null,
        details: {
          messageCount: request.messages.length,
          message: this.redactPII(request.message),
          context: request.context,
          includeCatalog: request.includeCatalog,
        },
        ipAddress: userContext.ipAddress,
        userAgent: userContext.userAgent,
      });

      await this.auditLogRepository.save(auditLog);
    } catch (error) {
      this.logger.error('Failed to log assistant request:', error);
    }
  }

  async logAssistantResponse(
    response: AssistantResponseDto,
    userContext: any
  ): Promise<void> {
    try {
      const auditLog = this.auditLogRepository.create({
        adminId: userContext.adminId,
        userId: userContext.userId,
        action: 'assistant_response',
        entityType: 'Assistant',
        entityId: null,
        details: {
          message: this.redactPII(response.message),
          toolCallsCount: response.toolCalls?.length || 0,
          finished: response.finished,
          usage: response.usage,
        },
        ipAddress: userContext.ipAddress,
        userAgent: userContext.userAgent,
      });

      await this.auditLogRepository.save(auditLog);
    } catch (error) {
      this.logger.error('Failed to log assistant response:', error);
    }
  }

  async logToolExecution(
    toolResult: ToolResultDto,
    userContext: any,
    beforeData?: any,
    afterData?: any
  ): Promise<void> {
    try {
      const auditLog = this.auditLogRepository.create({
        adminId: userContext.adminId,
        userId: userContext.userId,
        action: 'tool_execution',
        entityType: toolResult.explain?.entity || 'Unknown',
        entityId: null,
        details: {
          operation: toolResult.explain?.operation,
          mode: toolResult.mode,
          success: toolResult.success,
          affectedRecords: toolResult.explain?.affectedRecords,
          error: toolResult.error,
          idempotencyKey: toolResult.idempotencyKey,
          beforeData: beforeData ? this.redactPII(beforeData) : null,
          afterData: afterData ? this.redactPII(afterData) : null,
        },
        ipAddress: userContext.ipAddress,
        userAgent: userContext.userAgent,
      });

      await this.auditLogRepository.save(auditLog);
    } catch (error) {
      this.logger.error('Failed to log tool execution:', error);
    }
  }

  async logAssistantError(
    error: any,
    request: AssistantRequestDto,
    userContext: any
  ): Promise<void> {
    try {
      const auditLog = this.auditLogRepository.create({
        adminId: userContext.adminId,
        userId: userContext.userId,
        action: 'assistant_error',
        entityType: 'Assistant',
        entityId: null,
        details: {
          error: error.message,
          stack: error.stack,
          request: {
            messageCount: request.messages.length,
            message: this.redactPII(request.message),
          },
        },
        ipAddress: userContext.ipAddress,
        userAgent: userContext.userAgent,
      });

      await this.auditLogRepository.save(auditLog);
    } catch (error) {
      this.logger.error('Failed to log assistant error:', error);
    }
  }

  async getAssistantAuditLogs(
    adminId: string,
    userId?: string,
    limit: number = 50
  ): Promise<AuditLog[]> {
    const queryBuilder = this.auditLogRepository
      .createQueryBuilder('audit')
      .where('audit.adminId = :adminId', { adminId })
      .andWhere('audit.action LIKE :action', { action: 'assistant_%' })
      .orderBy('audit.createdAt', 'DESC')
      .limit(limit);

    if (userId) {
      queryBuilder.andWhere('audit.userId = :userId', { userId });
    }

    return queryBuilder.getMany();
  }

  async createReplayPayload(auditLogId: string): Promise<any> {
    const auditLog = await this.auditLogRepository.findOne({
      where: { id: auditLogId },
    });

    if (!auditLog) {
      throw new Error('Audit log not found');
    }

    // Create minimal replay payload
    return {
      action: auditLog.action,
      entityType: auditLog.entityType,
      details: auditLog.details,
      timestamp: auditLog.createdAt,
      userId: auditLog.userId,
      adminId: auditLog.adminId,
    };
  }

  private redactPII(data: any): any {
    if (typeof data === 'string') {
      return this.redactStringPII(data);
    }

    if (Array.isArray(data)) {
      return data.map(item => this.redactPII(item));
    }

    if (typeof data === 'object' && data !== null) {
      const redacted: any = {};
      for (const [key, value] of Object.entries(data)) {
        if (this.isPIIField(key)) {
          redacted[key] = '[REDACTED]';
        } else {
          redacted[key] = this.redactPII(value);
        }
      }
      return redacted;
    }

    return data;
  }

  private redactStringPII(text: string): string {
    // Redact email addresses
    text = text.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]');
    
    // Redact phone numbers (basic patterns)
    text = text.replace(/\b\d{3}-\d{3}-\d{4}\b/g, '[PHONE]');
    text = text.replace(/\b\(\d{3}\)\s*\d{3}-\d{4}\b/g, '[PHONE]');
    
    // Redact potential document numbers
    text = text.replace(/\b\d{8,12}\b/g, '[DOCUMENT]');
    
    return text;
  }

  private isPIIField(fieldName: string): boolean {
    const piiFields = [
      'email',
      'phone',
      'documentNumber',
      'emergencyContact',
      'emergencyPhone',
      'passwordHash',
      'resetPasswordToken',
    ];
    
    return piiFields.includes(fieldName.toLowerCase());
  }
}
