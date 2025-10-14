import { Injectable, Logger } from '@nestjs/common';
import {
  AssistantRequestDto,
  AssistantResponseDto,
  ChatMessage,
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
  ) {}

  async processMessage(
    request: AssistantRequestDto,
    userContext: any,
  ): Promise<AssistantResponseDto> {
    try {
      // Audit the request
      await this.auditService.logAssistantRequest(request, userContext);

      // Check if this is a query that should force tool execution
      const forcedToolCall = this.detectAndForceToolCall(request.message);

      if (forcedToolCall) {
        // Execute the forced tool call directly
        const toolResult = await this.llmService.executeToolCall(
          forcedToolCall,
          userContext,
        );

        // Generate natural language response
        const naturalResponse = this.generateNaturalResponse(
          request.message,
          forcedToolCall,
          toolResult,
        );

        const response = {
          message: naturalResponse,
          toolCalls: [forcedToolCall],
          timestamp: new Date().toISOString(),
          finished: true,
          usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 }
        };

        // Audit the response
        await this.auditService.logAssistantResponse(response, userContext);
        return response;
      }

      // Enrich context with catalog and glossary
      const enrichedMessages = await this.enrichContext(request, userContext);

      // Detect if this is simple conversation (no tools needed)
      const isSimpleConversation = this.isSimpleConversation(request.message);
      const tools = isSimpleConversation ? [] : undefined; // Empty array = no tools, undefined = default tools

      // Call LLM with or without function calling
      const response = await this.llmService.chatCompletion(
        enrichedMessages,
        tools,
        userContext,
      );

      // Audit the response
      await this.auditService.logAssistantResponse(response, userContext);

      return response;
    } catch (error) {
      this.logger.error('Error processing assistant message:', {
        error: error.message,
        stack: error.stack,
        userContext: {
          userId: userContext.userId,
          adminId: userContext.adminId,
          roles: userContext.roles?.map((r: any) => r.name || r),
          ipAddress: userContext.ipAddress,
        },
        request: {
          message: request.message,
          messagesCount: request.messages?.length || 0,
          includeCatalog: request.includeCatalog,
          context: request.context,
        },
        timestamp: new Date().toISOString(),
      });

      // Audit the error
      await this.auditService.logAssistantError(error, request, userContext);

      throw error;
    }
  }

  async streamMessage(
    request: AssistantRequestDto,
    userContext: any,
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
        userContext,
      );
    } catch (error) {
      this.logger.error('Error streaming assistant message:', {
        error: error.message,
        stack: error.stack,
        userContext: {
          userId: userContext.userId,
          adminId: userContext.adminId,
          roles: userContext.roles?.map((r: any) => r.name || r),
          ipAddress: userContext.ipAddress,
        },
        request: {
          message: request.message,
          messagesCount: request.messages?.length || 0,
          includeCatalog: request.includeCatalog,
          context: request.context,
        },
        timestamp: new Date().toISOString(),
      });
      await this.auditService.logAssistantError(error, request, userContext);
      throw error;
    }
  }

  private async enrichContext(
    request: AssistantRequestDto,
    userContext: any,
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
    const systemPrompt = `Eres un asistente inteligente especializado en gestión de consorcios. Tu objetivo es ayudar a los usuarios de manera proactiva y eficiente.

🎯 COMPORTAMIENTO INTELIGENTE:
- Para SALUDOS y CONVERSACIÓN GENERAL: Responde naturalmente en español
- Para CONSULTAS DE DATOS: Usa herramientas (find, create, update, delete)
- Para CREACIÓN/MODIFICACIÓN: Usa herramientas apropiadas

🔧 CUÁNDO USAR HERRAMIENTAS:
- Consultar edificios, tickets, usuarios, etc. → {"name": "find", "parameters": {"entity": "Building"}}
- Crear edificios, tickets, etc. → {"name": "create", "parameters": {"entity": "Building", "data": {...}}}
- Actualizar datos → {"name": "update", "parameters": {...}}
- Eliminar datos → {"name": "delete", "parameters": {...}}

🗣️ CUÁNDO RESPONDER CON TEXTO:
- Saludos: "hola", "buenos días", "¿cómo estás?"
- Agradecimientos: "gracias", "muchas gracias"
- Conversación general que no requiere datos del sistema

👤 CONTEXTO DEL USUARIO:
- ID de Usuario: ${userContext.userId}
- Administración: ${userContext.adminId}
- Roles: ${userContext.roles?.map((r: any) => r.name).join(', ') || 'No especificado'}

🏢 ENTIDADES PRINCIPALES:
- Building: Edificios del consorcio (campos: name, address, city, country, totalFloors, totalUnits)
- Ticket: Tickets de soporte (campos: title, description, priority)
- Unit: Unidades dentro de edificios
- User: Usuarios del sistema
- Vendor: Proveedores de servicios
- WorkOrder: Órdenes de trabajo
- Payment: Pagos realizados
- Expense: Gastos del sistema
- Meeting: Reuniones del consorcio
- Document: Documentos del consorcio

🎯 COMPORTAMIENTO PROACTIVO:
1. **SIEMPRE extrae TODA la información disponible** del mensaje del usuario
2. **NO pidas información que ya fue proporcionada**
3. **Sé específico sobre qué información falta** si algo es requerido
4. **Usa las herramientas inmediatamente** cuando tengas suficiente información
5. **Proporciona ejemplos claros** cuando expliques qué falta

📋 REGLAS PARA CREACIÓN DE EDIFICIOS:
Cuando el usuario quiera crear un edificio, extrae TODA la información disponible:

CAMPOS REQUERIDOS:
- name (nombre): Extrae de frases como "edificio llamado X", "nombre X", "se llama X"
- address (dirección): Extrae de "en la calle X", "dirección X", "ubicado en X", "en X 123"
- city (ciudad): Extrae de "en [ciudad]", "de la ciudad de X", "en X"

CAMPOS OPCIONALES:
- totalFloors (pisos): Extrae de "X pisos", "X plantas", "tiene X pisos"
- totalUnits (unidades): Extrae de "X unidades", "X departamentos", "X unidades en total"
- country (país): Por defecto "Argentina"

EJEMPLOS DE EXTRACCIÓN:
❌ MAL: "Falta información para crear el edificio"
✅ BIEN: Extraer de "edificio Maral8888 en mar del plata en avenida colon 7532 con 105 unidades"
→ {"name": "Maral8888", "city": "mar del plata", "address": "avenida colon 7532", "totalUnits": 105}

🎯 REGLAS DE RESPUESTA:
1. **Evalúa el tipo de consulta** antes de responder
2. **Para consultas de datos**: Usa herramientas apropiadas
3. **Para conversación general**: Responde naturalmente en español
4. **EXTRAE toda la información disponible** del mensaje del usuario
5. **NO pidas información que ya fue proporcionada**
6. **Sé específico** sobre qué campos exactos faltan si algo es requerido

📝 EJEMPLOS:

CONSULTAS DE DATOS (usar herramientas):
Usuario: "quiero que me des un listado de los nombres de los edificios del sistema"
TU RESPUESTA: {"name": "find", "parameters": {"entity": "Building"}}

Usuario: "crear edificio Maral8888 en mar del plata en avenida colon 7532 con 105 unidades"
TU RESPUESTA: {"name": "create", "parameters": {"entity": "Building", "data": {"name": "Maral8888", "city": "mar del plata", "address": "avenida colon 7532", "totalUnits": 105}}}

CONVERSACIÓN GENERAL (responder con texto):
Usuario: "hola"
TU RESPUESTA: ¡Hola! Soy tu asistente de consorcios. ¿En qué puedo ayudarte hoy?

Usuario: "¿cómo estás?"
TU RESPUESTA: ¡Todo bien! Estoy aquí para ayudarte con la gestión de edificios, tickets y más. ¿Qué necesitas?`;

    return systemPrompt.trim();
  }

  private detectAndForceToolCall(message: string): any | null {
    const lowerMessage = message.toLowerCase();
    this.logger.debug(`Detecting tool call for message: "${message}"`);
    this.logger.debug(`Lowercase message: "${lowerMessage}"`);

    // Detect building queries
    if ((lowerMessage.includes('listado') && lowerMessage.includes('edificio')) ||
        (lowerMessage.includes('mostrar') && lowerMessage.includes('edificio')) ||
        (lowerMessage.includes('ver') && lowerMessage.includes('edificio')) ||
        lowerMessage.includes('edificios del sistema') ||
        (lowerMessage.includes('todos') && lowerMessage.includes('edificios')) ||
        (lowerMessage.includes('mostrame') && lowerMessage.includes('edificios')) ||
        (lowerMessage.includes('que') && lowerMessage.includes('edificios') && lowerMessage.includes('hay')) ||
        (lowerMessage.includes('cuales') && lowerMessage.includes('edificios')) ||
        (lowerMessage.includes('edificios') && lowerMessage.includes('sistema'))) {
      return {
        name: 'find',
        parameters: { entity: 'Building' }
      };
    }

    // Detect ticket queries
    if ((lowerMessage.includes('listado') && lowerMessage.includes('ticket')) ||
        (lowerMessage.includes('mostrar') && lowerMessage.includes('ticket')) ||
        (lowerMessage.includes('ver') && lowerMessage.includes('ticket')) ||
        lowerMessage.includes('tickets del sistema') ||
        (lowerMessage.includes('todos') && lowerMessage.includes('tickets')) ||
        (lowerMessage.includes('mostrame') && lowerMessage.includes('tickets')) ||
        (lowerMessage.includes('titulos') && lowerMessage.includes('tickets')) ||
        (lowerMessage.includes('títulos') && lowerMessage.includes('tickets')) ||
        (lowerMessage.includes('tickets') && lowerMessage.includes('edificio')) ||
        (lowerMessage.includes('tickets') && lowerMessage.includes('vinculado'))) {

      // Check if they want building information included
      const wantsBuildingInfo = lowerMessage.includes('edificio') || lowerMessage.includes('vinculado') || lowerMessage.includes('building');

      return {
        name: 'find',
        parameters: {
          entity: 'Ticket',
          ...(wantsBuildingInfo && { relations: ['building'] })
        }
      };
    }

    // Detect user queries
    if (lowerMessage.includes('listado') && lowerMessage.includes('usuario') ||
        lowerMessage.includes('mostrar') && lowerMessage.includes('usuario') ||
        lowerMessage.includes('ver') && lowerMessage.includes('usuario')) {
      return {
        name: 'find',
        parameters: { entity: 'User' }
      };
    }

    // Detect ticket creation
    if ((lowerMessage.includes('crear') && lowerMessage.includes('ticket')) ||
        (lowerMessage.includes('create') && lowerMessage.includes('ticket')) ||
        (lowerMessage.includes('nuevo') && lowerMessage.includes('ticket')) ||
        (lowerMessage.includes('agregar') && lowerMessage.includes('ticket'))) {

      this.logger.debug('Detected ticket creation request');

      // Extract basic information from the message
      let title = 'Nuevo ticket';
      let description = message;
      let priority = 'MEDIUM'; // Default to MEDIUM
      let type = 'MAINTENANCE'; // Default type

      // Try to extract title/description and type
      if (lowerMessage.includes('mantenimiento')) {
        title = 'Mantenimiento';
        type = 'MAINTENANCE';
        if (lowerMessage.includes('ascensor')) {
          title = 'Mantenimiento de ascensor';
          description = 'Mantenimiento de ascensor';
        }
      } else if (lowerMessage.includes('reparacion') || lowerMessage.includes('reparar')) {
        title = 'Reparación';
        type = 'REPAIR';
      } else if (lowerMessage.includes('queja') || lowerMessage.includes('reclamo')) {
        title = 'Queja';
        type = 'COMPLAINT';
      } else if (lowerMessage.includes('emergencia') || lowerMessage.includes('urgente')) {
        title = 'Emergencia';
        type = 'EMERGENCY';
      } else if (lowerMessage.includes('limpieza')) {
        title = 'Limpieza';
        type = 'CLEANING';
      } else if (lowerMessage.includes('seguridad')) {
        title = 'Seguridad';
        type = 'SECURITY';
      }

      // Try to extract priority (using database enum values)
      if (lowerMessage.includes('alta') || lowerMessage.includes('urgente')) {
        priority = 'HIGH';
      } else if (lowerMessage.includes('baja')) {
        priority = 'LOW';
      } else {
        priority = 'MEDIUM';
      }

      // For now, we'll use the first building available as default
      // In a real scenario, we might want to ask the user which building
      return {
        name: 'create',
        parameters: {
          entity: 'Ticket',
          data: {
            title,
            description,
            priority,
            type,
            // We need to get a buildingId - for now we'll use a placeholder
            // The tool execution will need to handle this
            buildingId: 'FIRST_AVAILABLE_BUILDING'
          }
        }
      };
    }

    return null;
  }

  private generateNaturalResponse(message: string, toolCall: any, toolResult: any): string {
    if (toolCall.name === 'find' && toolCall.parameters.entity === 'Building') {
      // El resultado viene directamente en toolResult.data.items
      const items = toolResult?.data?.items || [];

      if (items && items.length > 0) {
        const buildingNames = items.map((building: any) => building.name).join(', ');
        return `Aquí tienes el listado de edificios en el sistema:\n\n${buildingNames}\n\nTotal: ${items.length} edificios encontrados.`;
      } else {
        return 'No se encontraron edificios en el sistema.';
      }
    }

    if (toolCall.name === 'find' && toolCall.parameters.entity === 'Ticket') {
      const items = toolResult?.data?.items || [];
      if (items && items.length > 0) {
        // Check if the user asked for building information
        const lowerMessage = message.toLowerCase();
        const wantsBuildingInfo = lowerMessage.includes('edificio') || lowerMessage.includes('vinculado') || lowerMessage.includes('building');

        if (wantsBuildingInfo) {
          const ticketDetails = items.map((ticket: any) => {
            const title = ticket.title || ticket.description || 'Sin título';
            const buildingName = ticket.building?.name || 'Sin edificio asignado';
            return `• ${title} - Edificio: ${buildingName}`;
          }).join('\n');
          return `Aquí tienes el listado de tickets con sus edificios vinculados:\n\n${ticketDetails}\n\nTotal: ${items.length} tickets encontrados.`;
        } else {
          const ticketTitles = items.map((ticket: any) => `• ${ticket.title || ticket.description || 'Sin título'}`).join('\n');
          return `Aquí tienes el listado de tickets en el sistema:\n\n${ticketTitles}\n\nTotal: ${items.length} tickets encontrados.`;
        }
      } else {
        return 'No se encontraron tickets en el sistema.';
      }
    }

    if (toolCall.name === 'find' && toolCall.parameters.entity === 'User') {
      const items = toolResult?.data?.items || [];
      if (items && items.length > 0) {
        return `Se encontraron ${items.length} usuarios en el sistema.`;
      } else {
        return 'No se encontraron usuarios en el sistema.';
      }
    }

    if (toolCall.name === 'create' && toolCall.parameters.entity === 'Ticket') {
      const ticketData = toolCall.parameters.data;
      if (toolResult?.data?.id) {
        return `✅ Se creó exitosamente el ticket "${ticketData.title}" con prioridad ${ticketData.priority}.\n\nID del ticket: ${toolResult.data.id}`;
      } else {
        return `✅ Se creó el ticket "${ticketData.title}" con prioridad ${ticketData.priority}.`;
      }
    }

    return 'Operación completada exitosamente.';
  }

  private isSimpleConversation(message: string): boolean {
    const lowerMessage = message.toLowerCase().trim();

    // Simple greetings
    const greetings = [
      'hola', 'hello', 'hi', 'hey',
      'buenos días', 'buenas tardes', 'buenas noches',
      'buen día', 'buenas'
    ];

    // Simple questions about state
    const simpleQuestions = [
      'como estas', '¿como estas?', 'cómo estás', '¿cómo estás?',
      'que tal', '¿que tal?', 'qué tal', '¿qué tal?',
      'como andas', '¿como andas?', 'cómo andás', '¿cómo andás?'
    ];

    // Gratitude expressions
    const gratitude = [
      'gracias', 'muchas gracias', 'thank you', 'thanks',
      'te agradezco', 'muy amable'
    ];

    // Farewells
    const farewells = [
      'chau', 'adiós', 'hasta luego', 'nos vemos',
      'bye', 'goodbye', 'see you'
    ];

    // Check if message matches any simple conversation pattern
    return greetings.includes(lowerMessage) ||
           simpleQuestions.includes(lowerMessage) ||
           gratitude.includes(lowerMessage) ||
           farewells.includes(lowerMessage);
  }

  async getHealth(): Promise<{
    status: string;
    llm: boolean;
    catalog: boolean;
  }> {
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
