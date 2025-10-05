import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AssistantConfig } from '../../../config/assistant.config';
import { AssistantResponseDto, ChatMessage } from '../dto/assistant.dto';
import { ToolType } from '../dto/tool-call.dto';
import { ToolExecutionService } from './tool-execution.service';

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);

  constructor(
    private configService: ConfigService,
    private toolExecutionService: ToolExecutionService
  ) { }

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
      let conversationMessages = [...messages];
      let maxIterations = 5; // Prevent infinite loops
      let iteration = 0;

      while (iteration < maxIterations) {
        iteration++;

        const requestBody = {
          model: assistantConfig.llm.model,
          messages: this.formatMessages(conversationMessages),
          tools: tools || this.getDefaultTools(),
          tool_choice: 'auto',
          temperature: 0.1,
          max_tokens: 4000,
          stream: false,
        };

        this.logger.debug('Sending request to LLM API:', {
          url: `${assistantConfig.llm.apiBase}/chat/completions`,
          body: JSON.stringify(requestBody, null, 2)
        });

        const response = await fetch(`${assistantConfig.llm.apiBase}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${assistantConfig.llm.apiKey}`,
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorText = await response.text();
          this.logger.error(`LLM API error: ${response.status} - ${errorText}`);
          throw new BadRequestException(`LLM API error: ${response.status}`);
        }

        const data = await response.json();
        const choice = data.choices?.[0];
        const message = choice?.message;

        // If no tool calls, return the final response
        if (!message?.tool_calls || message.tool_calls.length === 0) {
          return this.formatResponse(data);
        }

        // If the assistant provides content along with tool calls, it might be trying to give a final answer
        if (message.content && message.content.trim().length > 0) {
          this.logger.debug('Assistant provided content with tool calls, might be final answer:', message.content);
          return this.formatResponse(data);
        }

        // If we're on iteration 3 or higher and have successful tool results, force a final response
        if (iteration >= 3) {
          this.logger.debug('Forcing final response after iteration 3 to prevent infinite loops');
          const finalRequestBody = {
            model: assistantConfig.llm.model,
            messages: [...this.formatMessages(conversationMessages), {
              role: 'system',
              content: 'You have received tool results. Now provide a clear, direct answer to the user\'s question based on the data you received. Do not make any more tool calls.'
            }],
            temperature: 0.1,
            max_tokens: 1000,
            stream: false,
          };

          const finalResponse = await fetch(`${assistantConfig.llm.apiBase}/chat/completions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${assistantConfig.llm.apiKey}`,
            },
            body: JSON.stringify(finalRequestBody),
          });

          if (finalResponse.ok) {
            const finalData = await finalResponse.json();
            return this.formatResponse(finalData);
          }
        }

        // Add the assistant's message with tool calls to conversation
        conversationMessages.push({
          role: 'assistant',
          content: message.content || '',
          tool_calls: message.tool_calls
        });

        // Execute tool calls and add results to conversation
        for (const toolCall of message.tool_calls) {
          try {
            const toolCallDto = {
              id: toolCall.id,
              type: this.mapFunctionNameToToolType(toolCall.function.name),
              parameters: JSON.parse(toolCall.function.arguments)
            };

            const toolResult = await this.toolExecutionService.executeToolCall(
              toolCallDto,
              assistantConfig.defaultMode,
              undefined,
              context
            );

            const toolContent = JSON.stringify(toolResult);
            console.log(`Adding tool result for ${toolCall.id}:`, toolContent);

            conversationMessages.push({
              role: 'tool',
              content: toolContent,
              tool_call_id: toolCall.id
            });
          } catch (error) {
            this.logger.error(`Error executing tool call ${toolCall.id}:`, error);
            const errorContent = JSON.stringify({ error: error.message });
            console.log(`Adding error result for ${toolCall.id}:`, errorContent);

            conversationMessages.push({
              role: 'tool',
              content: errorContent,
              tool_call_id: toolCall.id
            });
          }
        }
      }

      // If we reach max iterations, return a response indicating that
      return {
        message: 'Maximum iterations reached. The assistant was unable to complete the request.',
        toolCalls: [],
        timestamp: new Date().toISOString(),
        finished: true,
        usage: undefined
      };
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
      ...(msg.tool_call_id && { tool_call_id: msg.tool_call_id }),
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

  private mapFunctionNameToToolType(functionName: string): ToolType {
    switch (functionName) {
      case 'find':
        return ToolType.FIND;
      case 'create':
        return ToolType.CREATE;
      case 'update':
        return ToolType.UPDATE;
      case 'delete':
        return ToolType.DELETE;
      case 'run_workflow':
        return ToolType.RUN_WORKFLOW;
      default:
        throw new BadRequestException(`Unknown function name: ${functionName}`);
    }
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
