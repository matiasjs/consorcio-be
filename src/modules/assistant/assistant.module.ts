import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// Entities
import { AuditLog } from '../../entities/audit-log.entity';

// Services
import { AssistantService } from './services/assistant.service';
import { LlmService } from './services/llm.service';
import { EntityCatalogService } from './services/entity-catalog.service';
import { ToolExecutionService } from './services/tool-execution.service';
import { AuditService } from './services/audit.service';

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
  ],
  exports: [
    AssistantService,
    LlmService,
    EntityCatalogService,
    ToolExecutionService,
    AuditService,
  ],
})
export class AssistantModule {}
