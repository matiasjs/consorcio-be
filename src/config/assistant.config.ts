import { registerAs } from '@nestjs/config';

export interface AssistantConfig {
  enabled: boolean;
  defaultMode: 'dry-run' | 'apply';
  llm: {
    provider: 'ollama' | 'openai';
    apiBase: string;
    apiKey: string;
    model: string;
    embedModel?: string;
  };
  rag: {
    enabled: boolean;
    pgvectorEnabled: boolean;
  };
}

export default registerAs('assistant', (): AssistantConfig => {
  const provider = (process.env.LLM_PROVIDER as 'ollama' | 'openai') || 'ollama';

  // Default configurations for each provider
  const providerDefaults = {
    ollama: {
      apiBase: 'http://localhost:8000/v1',
      model: 'qwen2.5-instruct',
      embedModel: 'text-embedding-3-small',
    },
    openai: {
      apiBase: 'https://api.openai.com/v1',
      model: 'gpt-4o-mini',
      embedModel: 'text-embedding-3-small',
    },
  };

  const defaults = providerDefaults[provider];

  return {
    enabled: process.env.ASSISTANT_ENABLED === 'true',
    defaultMode: (process.env.ASSISTANT_DEFAULT_MODE as 'dry-run' | 'apply') || 'apply',
    llm: {
      provider,
      apiBase: process.env.LLM_API_BASE || defaults.apiBase,
      apiKey: process.env.LLM_API_KEY || '',
      model: process.env.LLM_MODEL || defaults.model,
      embedModel: process.env.EMBED_MODEL || defaults.embedModel,
    },
    rag: {
      enabled: process.env.RAG_ENABLED === 'true',
      pgvectorEnabled: process.env.PGVECTOR_ENABLED === 'true',
    },
  };
});
