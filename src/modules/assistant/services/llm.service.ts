import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AssistantConfig } from '../../../config/assistant.config';
import { ChatMessage, AssistantResponseDto } from '../dto/assistant.dto';

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);

  constructor(private configService: ConfigService) {}

  async chatCompletion(
    messages: ChatMessage[],
    tools?: any[],
    context?: any
  ): Promise<AssistantResponseDto> {
    const assistantConfig = this.configService.get<AssistantConfig>('assistant');
    
    if (!assistantConfig?.enabled) {
      throw new BadRequestException('Assistant feature is disabled');
    }

    if (!assistantConfig.llm.apiKey) {
      throw new BadRequestException('LLM API key not configured');
    }

    try {
      const response = await fetch(`${assistantConfig.llm.apiBase}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${assistantConfig.llm.apiKey}`,
        },
        body: JSON.stringify({
          model: assistantConfig.llm.model,
          messages: this.formatMessages(messages),
          tools: tools || this.getDefaultTools(),
          tool_choice: 'auto',
          temperature: 0.1,
          max_tokens: 4000,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`LLM API error: ${response.status} - ${errorText}`);
        throw new BadRequestException(`LLM API error: ${response.status}`);
      }

      const data = await response.json();
      
      return this.formatResponse(data);
    } catch (error) {
      this.logger.error('Error calling LLM API:', error);
      throw new BadRequestException(`Failed to get LLM response: ${error.message}`);
    }
  }

  async streamChatCompletion(
    messages: ChatMessage[],
    tools?: any[],
    context?: any
  ): Promise<ReadableStream> {
    const assistantConfig = this.configService.get<AssistantConfig>('assistant');
    
    if (!assistantConfig?.enabled) {
      throw new BadRequestException('Assistant feature is disabled');
    }

    try {
      const response = await fetch(`${assistantConfig.llm.apiBase}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${assistantConfig.llm.apiKey}`,
        },
        body: JSON.stringify({
          model: assistantConfig.llm.model,
          messages: this.formatMessages(messages),
          tools: tools || this.getDefaultTools(),
          tool_choice: 'auto',
          temperature: 0.1,
          max_tokens: 4000,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new BadRequestException(`LLM API error: ${response.status}`);
      }

      return response.body!;
    } catch (error) {
      this.logger.error('Error streaming from LLM API:', error);
      throw new BadRequestException(`Failed to stream LLM response: ${error.message}`);
    }
  }

  private formatMessages(messages: ChatMessage[]): any[] {
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content,
      ...(msg.tool_calls && { tool_calls: msg.tool_calls }),
    }));
  }

  private formatResponse(data: any): AssistantResponseDto {
    const choice = data.choices?.[0];
    const message = choice?.message;

    return {
      message: message?.content || '',
      toolCalls: message?.tool_calls || [],
      timestamp: new Date().toISOString(),
      finished: choice?.finish_reason === 'stop' || choice?.finish_reason === 'tool_calls',
      usage: data.usage ? {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
      } : undefined,
    };
  }

  private getDefaultTools(): any[] {
    return [
      {
        type: 'function',
        function: {
          name: 'find',
          description: 'Find records in the database',
          parameters: {
            type: 'object',
            properties: {
              entity: {
                type: 'string',
                description: 'Entity name to query (e.g., User, Building, Ticket)',
              },
              where: {
                type: 'object',
                description: 'Where conditions for filtering',
              },
              select: {
                type: 'array',
                items: { type: 'string' },
                description: 'Fields to select',
              },
              orderBy: {
                type: 'object',
                description: 'Order by fields (field: ASC|DESC)',
              },
              limit: {
                type: 'number',
                description: 'Limit number of results',
              },
              page: {
                type: 'number',
                description: 'Page number for pagination',
              },
            },
            required: ['entity'],
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'create',
          description: 'Create a new record in the database',
          parameters: {
            type: 'object',
            properties: {
              entity: {
                type: 'string',
                description: 'Entity name to create (e.g., User, Building, Ticket)',
              },
              data: {
                type: 'object',
                description: 'Data for the new record',
              },
            },
            required: ['entity', 'data'],
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'update',
          description: 'Update existing records in the database',
          parameters: {
            type: 'object',
            properties: {
              entity: {
                type: 'string',
                description: 'Entity name to update',
              },
              where: {
                type: 'object',
                description: 'Where conditions to find records to update',
              },
              data: {
                type: 'object',
                description: 'Data to update',
              },
            },
            required: ['entity', 'where', 'data'],
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'delete',
          description: 'Delete records from the database',
          parameters: {
            type: 'object',
            properties: {
              entity: {
                type: 'string',
                description: 'Entity name to delete from',
              },
              where: {
                type: 'object',
                description: 'Where conditions to find records to delete',
              },
              hardDelete: {
                type: 'boolean',
                description: 'Whether to perform hard delete (default: false for soft delete)',
              },
            },
            required: ['entity', 'where'],
          },
        },
      },
    ];
  }

  async checkHealth(): Promise<boolean> {
    const assistantConfig = this.configService.get<AssistantConfig>('assistant');
    
    if (!assistantConfig?.enabled) {
      return false;
    }

    try {
      const response = await fetch(`${assistantConfig.llm.apiBase}/models`, {
        headers: {
          'Authorization': `Bearer ${assistantConfig.llm.apiKey}`,
        },
      });

      return response.ok;
    } catch (error) {
      this.logger.warn('LLM health check failed:', error.message);
      return false;
    }
  }
}
