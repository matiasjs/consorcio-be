import { Injectable, Logger } from '@nestjs/common';
import { LlmService } from './llm.service';
import { EntityCatalogService } from './entity-catalog.service';
import { AuditService } from './audit.service';
import { 
  AssistantRequestDto, 
  AssistantResponseDto, 
  ChatMessage, 
  AssistantContext 
} from '../dto/assistant.dto';

@Injectable()
export class AssistantService {
  private readonly logger = new Logger(AssistantService.name);

  constructor(
    private llmService: LlmService,
    private entityCatalogService: EntityCatalogService,
    private auditService: AuditService,
  ) {}

  async processMessage(
    request: AssistantRequestDto,
    userContext: any
  ): Promise<AssistantResponseDto> {
    try {
      // Audit the request
      await this.auditService.logAssistantRequest(request, userContext);

      // Enrich context with catalog and glossary
      const enrichedMessages = await this.enrichContext(request, userContext);

      // Call LLM with function calling
      const response = await this.llmService.chatCompletion(
        enrichedMessages,
        undefined, // Use default tools
        userContext
      );

      // Audit the response
      await this.auditService.logAssistantResponse(response, userContext);

      return response;
    } catch (error) {
      this.logger.error('Error processing assistant message:', error);
      
      // Audit the error
      await this.auditService.logAssistantError(error, request, userContext);
      
      throw error;
    }
  }

  async streamMessage(
    request: AssistantRequestDto,
    userContext: any
  ): Promise<ReadableStream> {
    try {
      // Audit the request
      await this.auditService.logAssistantRequest(request, userContext);

      // Enrich context with catalog and glossary
      const enrichedMessages = await this.enrichContext(request, userContext);

      // Stream from LLM
      return await this.llmService.streamChatCompletion(
        enrichedMessages,
        undefined, // Use default tools
        userContext
      );
    } catch (error) {
      this.logger.error('Error streaming assistant message:', error);
      await this.auditService.logAssistantError(error, request, userContext);
      throw error;
    }
  }

  private async enrichContext(
    request: AssistantRequestDto,
    userContext: any
  ): Promise<ChatMessage[]> {
    const messages: ChatMessage[] = [...request.messages];

    // Add the new user message
    messages.push({
      role: 'user',
      content: request.message,
      timestamp: new Date().toISOString(),
    });

    // Add system context if this is the first message or if catalog is requested
    if (messages.length === 1 || request.includeCatalog) {
      const systemContext = await this.buildSystemContext(userContext);
      
      messages.unshift({
        role: 'system',
        content: systemContext,
        timestamp: new Date().toISOString(),
      });
    }

    return messages;
  }

  private async buildSystemContext(userContext: any): Promise<string> {
    const catalog = await this.entityCatalogService.generateCatalog();
    
    const systemPrompt = `
Eres un asistente inteligente para un sistema de gestión de consorcios. Tu objetivo es ayudar a los usuarios a gestionar edificios, unidades, tickets, usuarios, proveedores y otros aspectos del consorcio.

CONTEXTO DEL USUARIO:
- ID de Usuario: ${userContext.userId}
- Administración: ${userContext.adminId}
- Roles: ${userContext.roles?.map((r: any) => r.name).join(', ') || 'No especificado'}

CAPACIDADES:
Puedes realizar las siguientes operaciones usando las herramientas disponibles:
1. FIND: Buscar y consultar registros en la base de datos
2. CREATE: Crear nuevos registros
3. UPDATE: Actualizar registros existentes
4. DELETE: Eliminar registros (soft delete por defecto)

ENTIDADES DISPONIBLES:
${catalog.entities.map(entity => `
- ${entity.name}: ${entity.description}
  Campos principales: ${entity.fields.slice(0, 5).map(f => `${f.name} (${f.type})`).join(', ')}
`).join('')}

RELACIONES IMPORTANTES:
${catalog.relationships.slice(0, 10).map(rel => `
- ${rel.from} → ${rel.to} (${rel.type} via ${rel.field})
`).join('')}

REGLAS IMPORTANTES:
1. SIEMPRE propón acciones antes de ejecutarlas
2. Usa dry-run por defecto para operaciones de modificación
3. Respeta los permisos del usuario y el contexto de la administración
4. Proporciona explicaciones claras de lo que vas a hacer
5. Si no estás seguro, pregunta por clarificación
6. Filtra siempre por adminId cuando sea relevante para mantener el aislamiento de datos

FORMATO DE RESPUESTA:
- Sé claro y conciso
- Explica qué operaciones vas a realizar
- Muestra los datos relevantes de forma estructurada
- Sugiere próximos pasos cuando sea apropiado

¿En qué puedo ayudarte hoy?
`;

    return systemPrompt.trim();
  }

  async getHealth(): Promise<{ status: string; llm: boolean; catalog: boolean }> {
    const llmHealth = await this.llmService.checkHealth();
    
    let catalogHealth = false;
    try {
      await this.entityCatalogService.generateCatalog();
      catalogHealth = true;
    } catch (error) {
      this.logger.warn('Catalog health check failed:', error.message);
    }

    return {
      status: llmHealth && catalogHealth ? 'healthy' : 'degraded',
      llm: llmHealth,
      catalog: catalogHealth,
    };
  }
}
