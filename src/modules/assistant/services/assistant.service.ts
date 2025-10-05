import { Injectable, Logger } from '@nestjs/common';
import {
  AssistantRequestDto,
  AssistantResponseDto,
  ChatMessage
} from '../dto/assistant.dto';
import { AuditService } from './audit.service';
import { EntityCatalogService } from './entity-catalog.service';
import { LlmService } from './llm.service';

@Injectable()
export class AssistantService {
  private readonly logger = new Logger(AssistantService.name);

  constructor(
    private llmService: LlmService,
    private entityCatalogService: EntityCatalogService,
    private auditService: AuditService,
  ) { }

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
    const systemPrompt = `You are an intelligent assistant for a consortium management system. Your goal is to help users manage buildings, units, tickets, users, vendors and other aspects of the consortium.

USER CONTEXT:
- User ID: ${userContext.userId}
- Administration: ${userContext.adminId}
- Roles: ${userContext.roles?.map((r: any) => r.name).join(', ') || 'Not specified'}

CAPABILITIES:
You can perform the following operations using the available tools:
1. FIND: Search and query database records
2. CREATE: Create new records
3. UPDATE: Update existing records
4. DELETE: Delete records (soft delete by default)

MAIN ENTITIES:
- User: System users with roles and permissions
- Building: Buildings managed by the consortium
- Unit: Functional units within buildings
- Ticket: Support and maintenance tickets
- Vendor: Service providers
- WorkOrder: Work orders for maintenance
- Payment: Payments made
- Expense: System expenses
- Meeting: Consortium meetings
- Document: Consortium documents

CRITICAL RULES FOR RESPONSES:
1. When you use the "find" tool, the response includes:
   - "items": array of actual records
   - "total": the TOTAL COUNT of all matching records (this is the answer for "how many" questions)
   - "page": current page number
   - "limit": records per page
2. For counting questions like "How many users are there?", use the "total" field from the response
3. Don't try to select a field called "total" - it's automatically provided in all find responses
4. **ALWAYS provide a clear final answer immediately after getting tool results**
5. **NEVER repeat the same query multiple times**
6. **After using a tool successfully, ALWAYS respond with text content, not more tool calls**

EXAMPLE:
User: "How many users are in the system?"
You should:
1. Use find tool with entity "User"
2. Read the "total" field from the response (e.g., "total": 7)
3. IMMEDIATELY respond with: "There are 7 users in the system."

REMEMBER: After getting tool results, you MUST provide a final text response to the user.

How can I help you today?`;

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
