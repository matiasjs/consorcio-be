import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ToolExecutionService } from '../services/tool-execution.service'
import { Building } from '../../../entities/building.entity'
import { User } from '../../../entities/user.entity'
import { Ticket } from '../../../entities/ticket.entity'
import { ToolCallDto, ToolType } from '../dto/tool-call.dto'

describe('Tool Execution Contract Tests', () => {
  let service: ToolExecutionService
  let buildingRepository: Repository<Building>
  let userRepository: Repository<User>
  let ticketRepository: Repository<Ticket>

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    metadata: {
      columns: [],
      relations: [],
    },
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ToolExecutionService,
        {
          provide: getRepositoryToken(Building),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Ticket),
          useValue: mockRepository,
        },
      ],
    }).compile()

    service = module.get<ToolExecutionService>(ToolExecutionService)
    buildingRepository = module.get<Repository<Building>>(getRepositoryToken(Building))
    userRepository = module.get<Repository<User>>(getRepositoryToken(User))
    ticketRepository = module.get<Repository<Ticket>>(getRepositoryToken(Ticket))
  })

  describe('Find Tool Contract Tests', () => {
    it('should execute find tool with valid Building entity', async () => {
      const toolCall: ToolCallDto = {
        type: ToolType.FIND,
        parameters: {
          entity: 'Building',
          where: { name: 'Torre Norte' },
          limit: 10,
        },
      }

      const mockBuildings = [
        { id: '1', name: 'Torre Norte', address: 'Av. Principal 123' },
        { id: '2', name: 'Torre Norte 2', address: 'Av. Principal 456' },
      ]

      mockRepository.find.mockResolvedValue(mockBuildings)
      mockRepository.count.mockResolvedValue(2)

      const result = await service.executeToolCall(toolCall, 'dry-run', 'test-user')

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockBuildings)
      expect(result.explain.entity).toBe('Building')
      expect(result.explain.operation).toContain('Búsqueda')
      expect(result.explain.affectedRecords).toBe(2)
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { name: 'Torre Norte' },
        take: 10,
      })
    })

    it('should execute find tool with User entity and relations', async () => {
      const toolCall: ToolCallDto = {
        type: ToolType.FIND,
        parameters: {
          entity: 'User',
          where: { isActive: true },
          include: ['roles', 'buildings'],
          limit: 5,
        },
      }

      const mockUsers = [
        { id: '1', email: 'user1@test.com', isActive: true },
        { id: '2', email: 'user2@test.com', isActive: true },
      ]

      mockRepository.find.mockResolvedValue(mockUsers)
      mockRepository.count.mockResolvedValue(2)

      const result = await service.executeToolCall(toolCall, 'dry-run', 'test-user')

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockUsers)
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { isActive: true },
        relations: ['roles', 'buildings'],
        take: 5,
      })
    })
  })

  describe('Create Tool Contract Tests', () => {
    it('should execute create tool with valid Ticket data (dry-run)', async () => {
      const toolCall: ToolCallDto = {
        type: ToolType.CREATE,
        parameters: {
          entity: 'Ticket',
          data: {
            title: 'Reparar puerta principal',
            description: 'La puerta principal no cierra correctamente',
            priority: 'high',
            status: 'open',
            buildingId: 'building-123',
            reportedById: 'user-456',
          },
        },
      }

      const mockTicket = {
        id: 'ticket-789',
        ...toolCall.parameters.data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockRepository.create.mockReturnValue(mockTicket)

      const result = await service.executeToolCall(toolCall, 'dry-run', 'test-user')

      expect(result.success).toBe(true)
      expect(result.mode).toBe('dry-run')
      expect(result.explain.entity).toBe('Ticket')
      expect(result.explain.operation).toContain('Creación')
      expect(result.explain.fieldsMapping).toBeDefined()
      expect(mockRepository.create).toHaveBeenCalledWith(toolCall.parameters.data)
      expect(mockRepository.save).not.toHaveBeenCalled() // Dry-run mode
    })

    it('should execute create tool with valid Building data (apply mode)', async () => {
      const toolCall: ToolCallDto = {
        type: ToolType.CREATE,
        parameters: {
          entity: 'Building',
          data: {
            name: 'Nuevo Edificio',
            address: 'Calle Nueva 789',
            floors: 10,
            units: 40,
          },
        },
      }

      const mockBuilding = {
        id: 'building-new',
        ...toolCall.parameters.data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockRepository.create.mockReturnValue(mockBuilding)
      mockRepository.save.mockResolvedValue(mockBuilding)

      const result = await service.executeToolCall(toolCall, 'apply', 'test-user')

      expect(result.success).toBe(true)
      expect(result.mode).toBe('apply')
      expect(result.data).toEqual(mockBuilding)
      expect(mockRepository.create).toHaveBeenCalledWith(toolCall.parameters.data)
      expect(mockRepository.save).toHaveBeenCalledWith(mockBuilding)
    })
  })

  describe('Update Tool Contract Tests', () => {
    it('should execute update tool with valid conditions (dry-run)', async () => {
      const toolCall: ToolCallDto = {
        type: ToolType.UPDATE,
        parameters: {
          entity: 'Ticket',
          where: { id: 'ticket-123' },
          data: { status: 'in_progress', assignedTo: 'user-789' },
        },
      }

      mockRepository.update.mockResolvedValue({ affected: 1 })

      const result = await service.executeToolCall(toolCall, 'dry-run', 'test-user')

      expect(result.success).toBe(true)
      expect(result.mode).toBe('dry-run')
      expect(result.explain.entity).toBe('Ticket')
      expect(result.explain.operation).toContain('Actualización')
      expect(result.explain.affectedRecords).toBe(1)
      expect(mockRepository.update).not.toHaveBeenCalled() // Dry-run mode
    })

    it('should execute update tool with valid conditions (apply mode)', async () => {
      const toolCall: ToolCallDto = {
        type: ToolType.UPDATE,
        parameters: {
          entity: 'User',
          where: { email: 'user@test.com' },
          data: { isActive: false, lastLoginAt: new Date() },
        },
      }

      mockRepository.update.mockResolvedValue({ affected: 1 })

      const result = await service.executeToolCall(toolCall, 'apply', 'test-user')

      expect(result.success).toBe(true)
      expect(result.mode).toBe('apply')
      expect(result.explain.affectedRecords).toBe(1)
      expect(mockRepository.update).toHaveBeenCalledWith(
        { email: 'user@test.com' },
        { isActive: false, lastLoginAt: expect.any(Date) }
      )
    })
  })

  describe('Delete Tool Contract Tests', () => {
    it('should execute delete tool with valid conditions (dry-run)', async () => {
      const toolCall: ToolCallDto = {
        type: ToolType.DELETE,
        parameters: {
          entity: 'Ticket',
          where: { status: 'closed', createdAt: { $lt: new Date('2023-01-01') } },
        },
      }

      mockRepository.count.mockResolvedValue(5)

      const result = await service.executeToolCall(toolCall, 'dry-run', 'test-user')

      expect(result.success).toBe(true)
      expect(result.mode).toBe('dry-run')
      expect(result.explain.entity).toBe('Ticket')
      expect(result.explain.operation).toContain('Eliminación')
      expect(result.explain.affectedRecords).toBe(5)
      expect(mockRepository.delete).not.toHaveBeenCalled() // Dry-run mode
    })
  })

  describe('Idempotency Tests', () => {
    it('should return cached result for duplicate idempotency key', async () => {
      const toolCall: ToolCallDto = {
        type: ToolType.FIND,
        parameters: {
          entity: 'Building',
          where: {},
        },
      }

      const idempotencyKey = 'test-key-123'

      // First call
      mockRepository.find.mockResolvedValue([])
      mockRepository.count.mockResolvedValue(0)

      const result1 = await service.executeToolCall(toolCall, 'dry-run', 'test-user', idempotencyKey)

      // Second call with same key
      const result2 = await service.executeToolCall(toolCall, 'dry-run', 'test-user', idempotencyKey)

      expect(result1.idempotencyKey).toBe(idempotencyKey)
      expect(result2.idempotencyKey).toBe(idempotencyKey)
      expect(result1.executedAt).toBe(result2.executedAt) // Should be cached
      expect(mockRepository.find).toHaveBeenCalledTimes(1) // Only called once
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid entity names', async () => {
      const toolCall: ToolCallDto = {
        type: ToolType.FIND,
        parameters: {
          entity: 'InvalidEntity',
          where: {},
        },
      }

      const result = await service.executeToolCall(toolCall, 'dry-run', 'test-user')

      expect(result.success).toBe(false)
      expect(result.error).toContain('Entity InvalidEntity not found')
    })

    it('should handle database errors', async () => {
      const toolCall: ToolCallDto = {
        type: ToolType.FIND,
        parameters: {
          entity: 'Building',
          where: {},
        },
      }

      mockRepository.find.mockRejectedValue(new Error('Database connection failed'))

      const result = await service.executeToolCall(toolCall, 'dry-run', 'test-user')

      expect(result.success).toBe(false)
      expect(result.error).toContain('Database connection failed')
    })

    it('should validate required fields for create operations', async () => {
      const toolCall: ToolCallDto = {
        type: ToolType.CREATE,
        parameters: {
          entity: 'User',
          data: {
            // Missing required email field
            firstName: 'John',
            lastName: 'Doe',
          },
        },
      }

      const result = await service.executeToolCall(toolCall, 'dry-run', 'test-user')

      expect(result.success).toBe(false)
      expect(result.error).toContain('validation')
    })
  })
})
