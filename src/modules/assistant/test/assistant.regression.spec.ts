import { Test, TestingModule } from '@nestjs/testing'
import { AssistantService } from '../services/assistant.service'
import { LLMService } from '../services/llm.service'
import { EntityCatalogService } from '../services/entity-catalog.service'
import { AuditService } from '../services/audit.service'
import { ConfigService } from '@nestjs/config'

describe('Assistant Regression Tests', () => {
  let service: AssistantService
  let llmService: LLMService

  const mockLLMService = {
    chatCompletion: jest.fn(),
    checkHealth: jest.fn().mockResolvedValue(true),
  }

  const mockEntityCatalogService = {
    generateCatalog: jest.fn().mockResolvedValue({
      entities: [],
      relationships: [],
      enums: {},
      generatedAt: new Date().toISOString(),
      version: '1.0.0',
    }),
  }

  const mockAuditService = {
    logAssistantRequest: jest.fn(),
    logAssistantResponse: jest.fn(),
    logAssistantError: jest.fn(),
  }

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config = {
        'assistant.enabled': true,
        'assistant.defaultMode': 'dry-run',
        'assistant.llm.model': 'qwen2.5-instruct',
        'assistant.llm.temperature': 0.1,
        'assistant.llm.maxTokens': 4000,
      }
      return config[key]
    }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssistantService,
        { provide: LLMService, useValue: mockLLMService },
        { provide: EntityCatalogService, useValue: mockEntityCatalogService },
        { provide: AuditService, useValue: mockAuditService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile()

    service = module.get<AssistantService>(AssistantService)
    llmService = module.get<LLMService>(LLMService)
  })

  describe('Regression Test Cases - Dry Run Mode', () => {
    const testCases = [
      {
        name: 'Consulta simple de edificios',
        message: 'Muéstrame todos los edificios',
        expectedToolCall: 'find',
        expectedEntity: 'Building',
      },
      {
        name: 'Búsqueda de tickets abiertos',
        message: 'Busca todos los tickets que están abiertos',
        expectedToolCall: 'find',
        expectedEntity: 'Ticket',
      },
      {
        name: 'Consulta de facturas vencidas',
        message: 'Encuentra las facturas que están vencidas',
        expectedToolCall: 'find',
        expectedEntity: 'Invoice',
      },
      {
        name: 'Listado de usuarios activos',
        message: 'Lista todos los usuarios activos del sistema',
        expectedToolCall: 'find',
        expectedEntity: 'User',
      },
      {
        name: 'Consulta de unidades por edificio',
        message: 'Muestra las unidades del edificio con ID 123',
        expectedToolCall: 'find',
        expectedEntity: 'Unit',
      },
      {
        name: 'Búsqueda de órdenes de trabajo pendientes',
        message: 'Busca las órdenes de trabajo que están pendientes',
        expectedToolCall: 'find',
        expectedEntity: 'WorkOrder',
      },
      {
        name: 'Consulta de inspecciones programadas',
        message: 'Muestra las inspecciones programadas para esta semana',
        expectedToolCall: 'find',
        expectedEntity: 'Inspection',
      },
      {
        name: 'Listado de proveedores disponibles',
        message: 'Lista todos los proveedores que están disponibles',
        expectedToolCall: 'find',
        expectedEntity: 'Vendor',
      },
      {
        name: 'Consulta de materiales con stock bajo',
        message: 'Encuentra los materiales que tienen stock bajo',
        expectedToolCall: 'find',
        expectedEntity: 'Material',
      },
      {
        name: 'Búsqueda de gastos del mes actual',
        message: 'Busca todos los gastos del mes actual',
        expectedToolCall: 'find',
        expectedEntity: 'Expense',
      },
      {
        name: 'Creación de ticket (dry-run)',
        message: 'Crea un nuevo ticket para reparar la puerta del edificio A',
        expectedToolCall: 'create',
        expectedEntity: 'Ticket',
      },
      {
        name: 'Actualización de estado de ticket (dry-run)',
        message: 'Cambia el estado del ticket 456 a "en progreso"',
        expectedToolCall: 'update',
        expectedEntity: 'Ticket',
      },
      {
        name: 'Creación de orden de trabajo (dry-run)',
        message: 'Crea una orden de trabajo para mantenimiento de ascensor',
        expectedToolCall: 'create',
        expectedEntity: 'WorkOrder',
      },
      {
        name: 'Actualización de información de usuario (dry-run)',
        message: 'Actualiza el email del usuario Juan Pérez a juan.nuevo@email.com',
        expectedToolCall: 'update',
        expectedEntity: 'User',
      },
      {
        name: 'Programación de inspección (dry-run)',
        message: 'Programa una inspección para el edificio B el próximo lunes',
        expectedToolCall: 'create',
        expectedEntity: 'Inspection',
      },
      {
        name: 'Consulta compleja con filtros múltiples',
        message: 'Busca tickets abiertos del edificio A creados en los últimos 30 días',
        expectedToolCall: 'find',
        expectedEntity: 'Ticket',
      },
      {
        name: 'Consulta de relaciones entre entidades',
        message: 'Muestra todos los usuarios que viven en el edificio Torre Norte',
        expectedToolCall: 'find',
        expectedEntity: 'User',
      },
      {
        name: 'Consulta de estadísticas',
        message: 'Cuántos tickets se resolvieron este mes',
        expectedToolCall: 'find',
        expectedEntity: 'Ticket',
      },
      {
        name: 'Búsqueda por rango de fechas',
        message: 'Encuentra las facturas emitidas entre el 1 y 15 de este mes',
        expectedToolCall: 'find',
        expectedEntity: 'Invoice',
      },
      {
        name: 'Consulta de disponibilidad',
        message: 'Verifica qué proveedores están disponibles para trabajar mañana',
        expectedToolCall: 'find',
        expectedEntity: 'Vendor',
      },
    ]

    testCases.forEach((testCase, index) => {
      it(`${index + 1}. ${testCase.name}`, async () => {
        // Mock LLM response with tool call
        const mockResponse = {
          message: `Voy a ${testCase.expectedToolCall === 'find' ? 'buscar' : 'crear/actualizar'} ${testCase.expectedEntity.toLowerCase()}s según tu solicitud.`,
          toolCalls: [
            {
              function: {
                name: testCase.expectedToolCall,
                arguments: JSON.stringify({
                  entity: testCase.expectedEntity,
                  where: testCase.expectedToolCall === 'find' ? {} : undefined,
                  data: testCase.expectedToolCall !== 'find' ? {} : undefined,
                }),
              },
            },
          ],
          timestamp: new Date().toISOString(),
          finished: true,
        }

        mockLLMService.chatCompletion.mockResolvedValue(mockResponse)

        const result = await service.processMessage({
          messages: [],
          message: testCase.message,
          context: {
            userId: 'test-user',
            tenantId: 'test-tenant',
            userRoles: ['USER'],
          },
          includeCatalog: true,
        })

        expect(result).toBeDefined()
        expect(result.message).toContain(testCase.expectedEntity.toLowerCase())
        expect(result.toolCalls).toBeDefined()
        expect(result.toolCalls.length).toBeGreaterThan(0)
        expect(mockAuditService.logAssistantRequest).toHaveBeenCalled()
        expect(mockAuditService.logAssistantResponse).toHaveBeenCalled()
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle LLM service errors gracefully', async () => {
      mockLLMService.chatCompletion.mockRejectedValue(new Error('LLM service unavailable'))

      await expect(
        service.processMessage({
          messages: [],
          message: 'Test message',
          context: { userId: 'test-user' },
        })
      ).rejects.toThrow('LLM service unavailable')

      expect(mockAuditService.logAssistantError).toHaveBeenCalled()
    })

    it('should handle invalid tool calls', async () => {
      const mockResponse = {
        message: 'Invalid response',
        toolCalls: [
          {
            function: {
              name: 'invalid_tool',
              arguments: 'invalid json',
            },
          },
        ],
        timestamp: new Date().toISOString(),
        finished: true,
      }

      mockLLMService.chatCompletion.mockResolvedValue(mockResponse)

      const result = await service.processMessage({
        messages: [],
        message: 'Test message',
        context: { userId: 'test-user' },
      })

      expect(result).toBeDefined()
      expect(result.message).toBeDefined()
    })
  })
})
