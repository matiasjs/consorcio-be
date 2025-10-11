import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { AuditLog } from '../../entities/audit-log.entity';

// Services
import { AssistantService } from './services/assistant.service';
import { AuditService } from './services/audit.service';
import { EntityCatalogService } from './services/entity-catalog.service';
import { LlmService } from './services/llm.service';
import { ToolExecutionService } from './services/tool-execution.service';

// Adapters
import { LlmProviderAdapter } from './adapters/llm-provider.adapter';

// Controllers
import { AssistantController } from './controllers/assistant.controller';
import { EntityCatalogController } from './controllers/entity-catalog.controller';
import { ToolExecutionController } from './controllers/tool-execution.controller';

// Configuration
import assistantConfig from '../../config/assistant.config';

@Module({
  imports: [
    ConfigModule.forFeature(assistantConfig),
    TypeOrmModule.forFeature([AuditLog]),
  ],
  controllers: [
    AssistantController,
    EntityCatalogController,
    ToolExecutionController,
  ],
  providers: [
    AssistantService,
    LlmService,
    EntityCatalogService,
    ToolExecutionService,
    AuditService,
    LlmProviderAdapter,
  ],
  exports: [
    AssistantService,
    LlmService,
    EntityCatalogService,
    ToolExecutionService,
    AuditService,
  ],
})
export class AssistantModule { }
