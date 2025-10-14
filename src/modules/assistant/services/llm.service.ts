import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AssistantConfig } from '../../../config/assistant.config';
import { ChatCompletionRequest, LlmProviderAdapter } from '../adapters/llm-provider.adapter';
import { AssistantResponseDto, ChatMessage } from '../dto/assistant.dto';
import { ToolType } from '../dto/tool-call.dto';
import { ToolExecutionService } from './tool-execution.service';

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);

  constructor(
    private configService: ConfigService,
    private toolExecutionService: ToolExecutionService,
    private llmProviderAdapter: LlmProviderAdapter,
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

        const request: ChatCompletionRequest = {
          model: assistantConfig.llm.model,
          messages: this.formatMessages(conversationMessages),
          tools: tools || this.getDefaultTools(),
          tool_choice: 'auto',
          temperature: 0.1,
          max_tokens: 4000,
          stream: false,
        };

        const data = await this.llmProviderAdapter.chatCompletion(request);
        const choice = data.choices?.[0];
        const message = choice?.message;

        // If no tool calls, check if content contains JSON tool calls
        if (!message?.tool_calls || message.tool_calls.length === 0) {
          // Try to parse JSON tool calls from content
          if (message?.content) {
            const parsedToolCalls = this.parseToolCallsFromContent(message.content);
            if (parsedToolCalls.length > 0) {
              this.logger.debug('Detected JSON tool calls in content, converting to proper tool_calls format');
              // Convert parsed tool calls to proper format
              data.choices[0].message.tool_calls = parsedToolCalls;
              data.choices[0].message.content = ''; // Clear content since we have tool calls
            } else {
              return this.formatResponse(data);
            }
          } else {
            return this.formatResponse(data);
          }
        }

        // If the assistant provides content along with tool calls, log it but continue with tool execution
        // The content might be malformed JSON or incomplete, so we should execute tools first
        if (message.content && message.content.trim().length > 0) {
          this.logger.debug('Assistant provided content with tool calls, will execute tools first:', message.content);
        }

        // If we're on iteration 3 or higher and have successful tool results, force a final response
        if (iteration >= 3) {
          this.logger.debug('Forcing final response after iteration 3 to prevent infinite loops');
          const finalRequest: ChatCompletionRequest = {
            model: assistantConfig.llm.model,
            messages: [...this.formatMessages(conversationMessages), {
              role: 'system',
              content: 'You have received tool results. Now provide a clear, direct answer to the user\'s question based on the data you received. Do not make any more tool calls.'
            }],
            temperature: 0.1,
            max_tokens: 1000,
            stream: false,
          };

          try {
            const finalData = await this.llmProviderAdapter.chatCompletion(finalRequest);
            return this.formatResponse(finalData);
          } catch (error) {
            this.logger.error('Error in forced final response:', error);
          }
        }

        // Add the assistant's message with tool calls to conversation
        conversationMessages.push({
          role: 'assistant',
          content: message.content || '',
          tool_calls: message.tool_calls
        });

        // Execute tool calls and add results to conversation
        for (const toolCall of message.tool_calls || []) {
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
            this.logger.error(`Error executing tool call ${toolCall.id}:`, {
              error: error.message,
              stack: error.stack,
              toolCall: {
                id: toolCall.id,
                function: toolCall.function.name,
                arguments: toolCall.function.arguments,
              },
              context: {
                userId: context?.userId,
                adminId: context?.adminId,
                iteration: iteration,
              },
              timestamp: new Date().toISOString(),
            });

            // Create a more descriptive error message for the AI
            const errorContent = JSON.stringify({
              error: error.message,
              tool_call_id: toolCall.id,
              function_name: toolCall.function.name,
              timestamp: new Date().toISOString(),
              instruction: "Explain this error to the user in natural language. Do not show raw JSON or technical details. Be helpful and suggest what the user can do to fix the issue."
            });
            console.log(`Adding error result for ${toolCall.id}:`, errorContent);

            conversationMessages.push({
              role: 'tool',
              content: errorContent,
              tool_call_id: toolCall.id
            });
          }
        }

        // After executing all tool calls, force a natural language response
        this.logger.debug('Tool calls executed, forcing natural language response');
        const finalRequest: ChatCompletionRequest = {
          model: assistantConfig.llm.model,
          messages: [...this.formatMessages(conversationMessages), {
            role: 'user',
            content: `IMPORTANTE: Basándote ÚNICAMENTE en los resultados que acabas de recibir, responde al usuario en español confirmando qué se guardó/creó exitosamente.

REGLAS IMPORTANTES:
- NO menciones "herramientas" ni procesos técnicos
- NO digas que "hubo un error" si algo se creó correctamente
- Sé directo y conciso
- Confirma solo lo que realmente se guardó en el sistema
- Usa un tono natural y profesional

Ejemplo: "Se guardó el edificio MDQ house 5.0 con 20 pisos en Mar del Plata, Córdoba 3731. También se creó el ticket de humedad en áreas comunes con prioridad alta."

Responde de manera simple y directa sobre lo que se guardó exitosamente.`
          }],
          temperature: 0.1,
          max_tokens: 200,
          stream: false,
        };

        try {
          const finalData = await this.llmProviderAdapter.chatCompletion(finalRequest);
          this.logger.debug('Final response from LLM:', JSON.stringify(finalData, null, 2));
          const finalResponse = this.formatResponse(finalData);
          this.logger.debug('Final natural language response generated successfully:', finalResponse.message);
          return finalResponse;
        } catch (error) {
          this.logger.error('Error in final natural language response:', error);
          // Return a fallback response if final response fails
          return {
            message: 'Las operaciones se completaron exitosamente, pero hubo un problema al generar la respuesta final.',
            toolCalls: [],
            timestamp: new Date().toISOString(),
            finished: true,
            usage: undefined
          };
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
      this.logger.error('Error calling LLM API:', {
        error: error.message,
        stack: error.stack,
        context: {
          userId: context?.userId,
          adminId: context?.adminId,
          messagesCount: messages?.length || 0,
          toolsCount: tools?.length || 0,
        },
        config: {
          model: assistantConfig?.llm?.model,
          provider: assistantConfig?.llm?.provider,
          apiBase: assistantConfig?.llm?.apiBase,
        },
        timestamp: new Date().toISOString(),
      });
      throw new BadRequestException(`Failed to get LLM response: ${error.message}`);
    }
  }

  async streamChatCompletion(
    messages: ChatMessage[],
    tools?: any[],
    context?: any
  ): Promise<ReadableStream> {
    try {
      const request: ChatCompletionRequest = {
        model: '', // Will be set by the adapter based on provider
        messages: this.formatMessages(messages),
        tools: tools || this.getDefaultTools(),
        tool_choice: 'auto',
        temperature: 0.1,
        max_tokens: 4000,
        stream: true,
      };

      return await this.llmProviderAdapter.streamChatCompletion(request);
    } catch (error) {
      this.logger.error('Error streaming from LLM API:', {
        error: error.message,
        stack: error.stack,
        context: {
          userId: context?.userId,
          adminId: context?.adminId,
          messagesCount: messages?.length || 0,
          toolsCount: tools?.length || 0,
        },
        timestamp: new Date().toISOString(),
      });
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

  private parseToolCallsFromContent(content: string): any[] {
    const toolCalls: any[] = [];

    try {
      // First try to parse multiple JSON objects separated by semicolons
      const parts = content.split(';').map(part => part.trim()).filter(part => part.length > 0);
      for (const part of parts) {
        try {
          // Try to fix common JSON formatting issues
          let fixedPart = part;

          // Add missing closing braces if needed
          const openBraces = (fixedPart.match(/\{/g) || []).length;
          const closeBraces = (fixedPart.match(/\}/g) || []).length;
          if (openBraces > closeBraces) {
            fixedPart += '}'.repeat(openBraces - closeBraces);
          }

          const parsed = JSON.parse(fixedPart);
          if (parsed.name && parsed.parameters) {
            // Fix priority mapping for tickets
            if (parsed.parameters.entity === 'Ticket' && parsed.parameters.data?.priority) {
              const priorityMap = {
                'High': 'alta',
                'Medium': 'media',
                'Low': 'baja',
                'alta': 'alta',
                'media': 'media',
                'baja': 'baja'
              };
              parsed.parameters.data.priority = priorityMap[parsed.parameters.data.priority] || 'media';
            }

            // Fix title field for tickets (map subject to title)
            if (parsed.parameters.entity === 'Ticket' && parsed.parameters.data?.subject && !parsed.parameters.data?.title) {
              parsed.parameters.data.title = parsed.parameters.data.subject;
              delete parsed.parameters.data.subject;
            }

            toolCalls.push({
              id: `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              type: 'function',
              function: {
                name: parsed.name,
                arguments: JSON.stringify(parsed.parameters)
              }
            });
          }
        } catch (parseError) {
          this.logger.warn('Failed to parse JSON part:', part);
        }
      }

      // If no semicolon-separated parts worked, try regex pattern matching
      if (toolCalls.length === 0) {
        const jsonPattern = /\{"name":\s*"([^"]+)"\s*,\s*"parameters":\s*(\{[^}]*\}+)\s*\}/g;
        let match;

        while ((match = jsonPattern.exec(content)) !== null) {
          const [, name, parametersStr] = match;
          try {
            const parameters = JSON.parse(parametersStr);
            toolCalls.push({
              id: `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              type: 'function',
              function: {
                name: name,
                arguments: JSON.stringify(parameters)
              }
            });
          } catch (parseError) {
            this.logger.warn('Failed to parse parameters for tool call:', parametersStr);
          }
        }
      }

    } catch (error) {
      this.logger.warn('Error parsing tool calls from content:', error);
    }

    return toolCalls;
  }

  async executeToolCall(toolCall: any, userContext: any): Promise<any> {
    try {
      this.logger.debug('Executing forced tool call:', {
        toolCall,
        userContext: {
          userId: userContext.userId,
          adminId: userContext.adminId,
        },
      });

      const result = await this.toolExecutionService.executeToolCall(
        { type: toolCall.name as any, parameters: toolCall.parameters },
        'apply',
        undefined, // idempotencyKey
        userContext,
      );

      this.logger.debug('Tool execution result:', { result });
      return result;
    } catch (error) {
      this.logger.error('Error executing forced tool call:', {
        error: error.message,
        toolCall,
        userContext: {
          userId: userContext.userId,
          adminId: userContext.adminId,
        },
      });
      throw error;
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
