import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AssistantConfig } from '../../../config/assistant.config';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  tool_calls?: any[];
  tool_call_id?: string;
}

export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  tools?: any[];
  tool_choice?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
      tool_calls?: any[];
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

@Injectable()
export class LlmProviderAdapter {
  private readonly logger = new Logger(LlmProviderAdapter.name);

  constructor(private readonly configService: ConfigService) {}

  async chatCompletion(
    request: ChatCompletionRequest,
  ): Promise<ChatCompletionResponse> {
    const assistantConfig =
      this.configService.get<AssistantConfig>('assistant');

    if (!assistantConfig?.enabled) {
      throw new Error('Assistant feature is disabled');
    }

    if (!assistantConfig.llm.apiKey) {
      throw new Error('LLM API key not configured');
    }

    const provider = assistantConfig.llm.provider;

    this.logger.debug(`Using LLM provider: ${provider}`);

    switch (provider) {
      case 'ollama':
        return this.callOllamaAPI(request, assistantConfig);
      case 'openai':
        return this.callOpenAIAPI(request, assistantConfig);
      default:
        throw new Error(`Unsupported LLM provider: ${provider}`);
    }
  }

  private async callOllamaAPI(
    request: ChatCompletionRequest,
    config: AssistantConfig,
  ): Promise<ChatCompletionResponse> {
    // Ollama uses OpenAI-compatible API through LiteLLM
    const requestBody = {
      model: config.llm.model,
      messages: this.formatMessagesForOllama(request.messages),
      tools: request.tools,
      tool_choice: request.tool_choice,
      temperature: request.temperature || 0.1,
      max_tokens: request.max_tokens || 4000,
      stream: request.stream || false,
    };

    this.logger.debug('Sending request to Ollama API:', {
      url: `${config.llm.apiBase}/chat/completions`,
      model: requestBody.model,
      messagesCount: requestBody.messages.length,
      toolsCount: requestBody.tools?.length || 0,
    });

    const response = await fetch(`${config.llm.apiBase}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.llm.apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      this.logger.error('Ollama API error:', {
        status: response.status,
        statusText: response.statusText,
        errorText: errorText,
        url: `${config.llm.apiBase}/chat/completions`,
        model: requestBody.model,
        messagesCount: requestBody.messages.length,
        toolsCount: requestBody.tools?.length || 0,
        timestamp: new Date().toISOString(),
      });
      throw new Error(`Ollama API error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  private async callOpenAIAPI(
    request: ChatCompletionRequest,
    config: AssistantConfig,
  ): Promise<ChatCompletionResponse> {
    const requestBody = {
      model: config.llm.model,
      messages: this.formatMessagesForOpenAI(request.messages),
      tools: request.tools,
      tool_choice: request.tool_choice,
      temperature: request.temperature || 0.1,
      max_tokens: request.max_tokens || 4000,
      stream: request.stream || false,
    };

    this.logger.debug('Sending request to OpenAI API:', {
      url: `${config.llm.apiBase}/chat/completions`,
      model: requestBody.model,
      messagesCount: requestBody.messages.length,
      toolsCount: requestBody.tools?.length || 0,
    });

    const response = await fetch(`${config.llm.apiBase}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.llm.apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      this.logger.error('OpenAI API error:', {
        status: response.status,
        statusText: response.statusText,
        errorText: errorText,
        url: `${config.llm.apiBase}/chat/completions`,
        model: requestBody.model,
        messagesCount: requestBody.messages.length,
        toolsCount: requestBody.tools?.length || 0,
        timestamp: new Date().toISOString(),
      });
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  private formatMessagesForOllama(messages: ChatMessage[]): any[] {
    // Ollama through LiteLLM uses the same format as OpenAI
    return this.formatMessagesForOpenAI(messages);
  }

  private formatMessagesForOpenAI(messages: ChatMessage[]): any[] {
    return messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
      ...(msg.tool_calls && { tool_calls: msg.tool_calls }),
      ...(msg.tool_call_id && { tool_call_id: msg.tool_call_id }),
    }));
  }

  async streamChatCompletion(
    request: ChatCompletionRequest,
  ): Promise<ReadableStream> {
    const assistantConfig =
      this.configService.get<AssistantConfig>('assistant');

    if (!assistantConfig?.enabled) {
      throw new Error('Assistant feature is disabled');
    }

    if (!assistantConfig.llm.apiKey) {
      throw new Error('LLM API key not configured');
    }

    const provider = assistantConfig.llm.provider;

    this.logger.debug(`Using LLM provider for streaming: ${provider}`);

    const requestBody = {
      model: assistantConfig.llm.model,
      messages:
        provider === 'openai'
          ? this.formatMessagesForOpenAI(request.messages)
          : this.formatMessagesForOllama(request.messages),
      tools: request.tools,
      tool_choice: request.tool_choice,
      temperature: request.temperature || 0.1,
      max_tokens: request.max_tokens || 4000,
      stream: true,
    };

    const response = await fetch(
      `${assistantConfig.llm.apiBase}/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${assistantConfig.llm.apiKey}`,
        },
        body: JSON.stringify(requestBody),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      this.logger.error(`${provider} API streaming error:`, {
        provider: provider,
        status: response.status,
        statusText: response.statusText,
        errorText: errorText,
        url: `${assistantConfig.llm.apiBase}/chat/completions`,
        model: requestBody.model,
        messagesCount: requestBody.messages.length,
        toolsCount: requestBody.tools?.length || 0,
        timestamp: new Date().toISOString(),
      });
      throw new Error(`${provider} API streaming error: ${response.status} - ${errorText}`);
    }

    return response.body!;
  }
}
