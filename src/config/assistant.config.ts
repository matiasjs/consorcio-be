import { registerAs } from '@nestjs/config';

export interface AssistantConfig {
  enabled: boolean;
  defaultMode: 'dry-run' | 'apply';
  llm: {
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

export default registerAs('assistant', (): AssistantConfig => ({
  enabled: process.env.ASSISTANT_ENABLED === 'true',
  defaultMode: (process.env.ASSISTANT_DEFAULT_MODE as 'dry-run' | 'apply') || 'dry-run',
  llm: {
    apiBase: process.env.LLM_API_BASE || 'http://llm-gateway:8000/v1',
    apiKey: process.env.LLM_API_KEY || '',
    model: process.env.LLM_MODEL || 'qwen2.5-instruct',
    embedModel: process.env.EMBED_MODEL || 'text-embedding-3-small',
  },
  rag: {
    enabled: process.env.RAG_ENABLED === 'true',
    pgvectorEnabled: process.env.PGVECTOR_ENABLED === 'true',
  },
}));
