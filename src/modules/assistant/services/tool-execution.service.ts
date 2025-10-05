import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource, Repository } from 'typeorm';
import { AssistantConfig } from '../../../config/assistant.config';
import {
  CreateToolDto,
  DeleteToolDto,
  FindToolDto,
  RunWorkflowToolDto,
  ToolCallDto,
  ToolResultDto,
  ToolType,
  UpdateToolDto
} from '../dto/tool-call.dto';

@Injectable()
export class ToolExecutionService {
  private idempotencyCache = new Map<string, ToolResultDto>();

  constructor(
    private dataSource: DataSource,
    private configService: ConfigService,
  ) { }

  async executeToolCall(
    toolCall: ToolCallDto,
    mode: 'dry-run' | 'apply',
    idempotencyKey?: string,
    userContext?: any
  ): Promise<ToolResultDto> {
    // Check idempotency
    if (idempotencyKey && this.idempotencyCache.has(idempotencyKey)) {
      return this.idempotencyCache.get(idempotencyKey)!;
    }

    const assistantConfig = this.configService.get<AssistantConfig>('assistant');
    const effectiveMode = mode || assistantConfig?.defaultMode || 'dry-run';

    let result: ToolResultDto;

    try {
      switch (toolCall.type) {
        case ToolType.FIND:
          result = await this.executeFindTool(toolCall.parameters as FindToolDto, effectiveMode, userContext);
          break;
        case ToolType.CREATE:
          result = await this.executeCreateTool(toolCall.parameters as CreateToolDto, effectiveMode, userContext);
          break;
        case ToolType.UPDATE:
          result = await this.executeUpdateTool(toolCall.parameters as UpdateToolDto, effectiveMode, userContext);
          break;
        case ToolType.DELETE:
          result = await this.executeDeleteTool(toolCall.parameters as DeleteToolDto, effectiveMode, userContext);
          break;
        case ToolType.RUN_WORKFLOW:
          result = await this.executeWorkflowTool(toolCall.parameters as RunWorkflowToolDto, effectiveMode, userContext);
          break;
        default:
          throw new BadRequestException(`Unknown tool type: ${toolCall.type}`);
      }

      result.idempotencyKey = idempotencyKey;

      // Cache result if idempotency key provided
      if (idempotencyKey) {
        this.idempotencyCache.set(idempotencyKey, result);
        // Clean up cache after 1 hour
        setTimeout(() => this.idempotencyCache.delete(idempotencyKey), 3600000);
      }

      return result;
    } catch (error) {
      const errorResult: ToolResultDto = {
        success: false,
        error: error.message,
        mode: effectiveMode,
        executedAt: new Date().toISOString(),
        idempotencyKey,
      };

      if (idempotencyKey) {
        this.idempotencyCache.set(idempotencyKey, errorResult);
      }

      return errorResult;
    }
  }

  private async executeFindTool(params: FindToolDto, mode: string, userContext?: any): Promise<ToolResultDto> {
    console.log('executeFindTool called with params:', JSON.stringify(params, null, 2));

    try {
      const repository = this.getRepository(params.entity);

      const queryBuilder = repository.createQueryBuilder(params.entity.toLowerCase());

      // Apply where conditions
      if (params.where) {
        Object.entries(params.where).forEach(([key, value], index) => {
          const paramName = `param${index}`;
          queryBuilder.andWhere(`${params.entity.toLowerCase()}.${key} = :${paramName}`, { [paramName]: value });
        });
      }

      // Apply select fields
      if (params.select && params.select.length > 0) {
        // Handle aggregation functions like count(*)
        const selectFields = params.select.map(field => {
          if (field.includes('count(') || field.includes('sum(') || field.includes('avg(') || field.includes('max(') || field.includes('min(')) {
            return field; // Use as-is for aggregation functions
          }
          return `${params.entity.toLowerCase()}.${field}`;
        });
        queryBuilder.select(selectFields);
      }

      // Apply ordering
      if (params.orderBy) {
        // Handle both formats: {"field": "ASC"} and {"field": "id", "ASC": true}
        if (params.orderBy.field && (params.orderBy.ASC !== undefined || params.orderBy.DESC !== undefined)) {
          // Format: {"field": "id", "ASC": true}
          const direction = params.orderBy.ASC ? 'ASC' : 'DESC';
          queryBuilder.addOrderBy(`${params.entity.toLowerCase()}.${params.orderBy.field}`, direction);
        } else {
          // Format: {"id": "ASC", "name": "DESC"}
          Object.entries(params.orderBy).forEach(([field, direction]) => {
            queryBuilder.addOrderBy(`${params.entity.toLowerCase()}.${field}`, direction);
          });
        }
      }

      // Apply pagination
      if (params.limit) {
        queryBuilder.limit(params.limit);
      }
      if (params.page && params.limit) {
        queryBuilder.offset((params.page - 1) * params.limit);
      }

      const [data, total] = await queryBuilder.getManyAndCount();

      const result = {
        success: true,
        data: {
          items: data,
          total,
          page: params.page || 1,
          limit: params.limit || total,
        },
        explain: {
          operation: 'find',
          entity: params.entity,
          affectedRecords: data.length,
        },
        mode: mode as any,
        executedAt: new Date().toISOString(),
      };

      console.log('executeFindTool result:', JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.log('executeFindTool error:', error.message);
      const errorResult = {
        success: false,
        data: null,
        error: error.message,
        explain: {
          operation: 'find',
          entity: params.entity,
          affectedRecords: 0,
        },
        mode: mode as any,
        executedAt: new Date().toISOString(),
      };
      console.log('executeFindTool error result:', JSON.stringify(errorResult, null, 2));
      return errorResult;
    }
  }

  private async executeCreateTool(params: CreateToolDto, mode: string, userContext?: any): Promise<ToolResultDto> {
    const repository = this.getRepository(params.entity);

    if (mode === 'dry-run') {
      // Validate data without creating
      const entity = repository.create(params.data);

      return {
        success: true,
        data: { preview: entity },
        explain: {
          operation: 'create (dry-run)',
          entity: params.entity,
          fieldsMapping: this.getFieldsMapping(params.data),
          affectedRecords: 1,
        },
        mode: mode as any,
        executedAt: new Date().toISOString(),
      };
    }

    // Add user context if available
    const dataWithContext = {
      ...params.data,
      ...(userContext?.adminId && { adminId: userContext.adminId }),
    };

    const entity = repository.create(dataWithContext);
    const savedEntity = await repository.save(entity);

    return {
      success: true,
      data: savedEntity,
      explain: {
        operation: 'create',
        entity: params.entity,
        fieldsMapping: this.getFieldsMapping(params.data),
        affectedRecords: 1,
      },
      mode: mode as any,
      executedAt: new Date().toISOString(),
    };
  }

  private async executeUpdateTool(params: UpdateToolDto, mode: string, userContext?: any): Promise<ToolResultDto> {
    const repository = this.getRepository(params.entity);

    // Find records to update
    const recordsToUpdate = await repository.find({ where: params.where });

    if (recordsToUpdate.length === 0) {
      throw new NotFoundException(`No records found matching the criteria`);
    }

    if (mode === 'dry-run') {
      return {
        success: true,
        data: {
          preview: recordsToUpdate.map(record => ({ ...record, ...params.data })),
          recordsFound: recordsToUpdate.length
        },
        explain: {
          operation: 'update (dry-run)',
          entity: params.entity,
          fieldsMapping: this.getFieldsMapping(params.data),
          affectedRecords: recordsToUpdate.length,
        },
        mode: mode as any,
        executedAt: new Date().toISOString(),
      };
    }

    const result = await repository.update(params.where, params.data);

    return {
      success: true,
      data: { affected: result.affected },
      explain: {
        operation: 'update',
        entity: params.entity,
        fieldsMapping: this.getFieldsMapping(params.data),
        affectedRecords: result.affected || 0,
      },
      mode: mode as any,
      executedAt: new Date().toISOString(),
    };
  }

  private async executeDeleteTool(params: DeleteToolDto, mode: string, userContext?: any): Promise<ToolResultDto> {
    const repository = this.getRepository(params.entity);

    // Find records to delete
    const recordsToDelete = await repository.find({ where: params.where });

    if (recordsToDelete.length === 0) {
      throw new NotFoundException(`No records found matching the criteria`);
    }

    if (mode === 'dry-run') {
      return {
        success: true,
        data: {
          preview: recordsToDelete,
          recordsFound: recordsToDelete.length,
          deleteType: params.hardDelete ? 'hard' : 'soft'
        },
        explain: {
          operation: 'delete (dry-run)',
          entity: params.entity,
          affectedRecords: recordsToDelete.length,
        },
        mode: mode as any,
        executedAt: new Date().toISOString(),
      };
    }

    let result;
    if (params.hardDelete) {
      result = await repository.delete(params.where);
    } else {
      result = await repository.softDelete(params.where);
    }

    return {
      success: true,
      data: { affected: result.affected },
      explain: {
        operation: params.hardDelete ? 'hard delete' : 'soft delete',
        entity: params.entity,
        affectedRecords: result.affected || 0,
      },
      mode: mode as any,
      executedAt: new Date().toISOString(),
    };
  }

  private async executeWorkflowTool(params: RunWorkflowToolDto, mode: string, userContext?: any): Promise<ToolResultDto> {
    // This is a placeholder for workflow execution
    // In a real implementation, you would have a workflow engine

    throw new BadRequestException(`Workflow execution not implemented yet. Workflow: ${params.name}`);
  }

  private getRepository(entityName: string): Repository<any> {
    try {
      const metadata = this.dataSource.entityMetadatas.find(
        meta => meta.name.toLowerCase() === entityName.toLowerCase()
      );

      if (!metadata) {
        throw new BadRequestException(`Entity '${entityName}' not found`);
      }

      return this.dataSource.getRepository(metadata.target);
    } catch (error) {
      throw new BadRequestException(`Failed to get repository for entity '${entityName}': ${error.message}`);
    }
  }

  private getFieldsMapping(data: Record<string, any>): Record<string, string> {
    const mapping: Record<string, string> = {};

    Object.keys(data).forEach(key => {
      const value = data[key];
      const type = typeof value;
      mapping[key] = `${type}${Array.isArray(value) ? '[]' : ''}`;
    });

    return mapping;
  }
}
