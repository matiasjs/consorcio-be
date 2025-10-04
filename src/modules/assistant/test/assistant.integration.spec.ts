import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import * as request from 'supertest'
import { AssistantModule } from '../assistant.module'
import { User } from '../../../entities/user.entity'
import { Role } from '../../../entities/role.entity'
import { Building } from '../../../entities/building.entity'
import { Ticket } from '../../../entities/ticket.entity'
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard'

describe('Assistant Integration Tests (Apply Mode)', () => {
  let app: INestApplication
  let adminUser: User
  let regularUser: User
  let testBuilding: Building

  const mockJwtGuard = {
    canActivate: jest.fn(() => true),
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [
            () => ({
              assistant: {
                enabled: true,
                defaultMode: 'dry-run',
                llm: {
                  apiBase: 'http://localhost:8000/v1',
                  apiKey: 'test-key',
                  model: 'qwen2.5-instruct',
                },
              },
            }),
          ],
        }),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User, Role, Building, Ticket],
          synchronize: true,
        }),
        AssistantModule,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtGuard)
      .compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    // Setup test data
    await setupTestData()
  })

  afterAll(async () => {
    await app.close()
  })

  const setupTestData = async () => {
    // Create roles
    const adminRole = new Role()
    adminRole.name = 'ADMIN'
    adminRole.permissions = ['assistant:apply']

    const userRole = new Role()
    userRole.name = 'USER'
    userRole.permissions = ['assistant:read']

    // Create users
    adminUser = new User()
    adminUser.email = 'admin@test.com'
    adminUser.firstName = 'Admin'
    adminUser.lastName = 'User'
    adminUser.roles = [adminRole]

    regularUser = new User()
    regularUser.email = 'user@test.com'
    regularUser.firstName = 'Regular'
    regularUser.lastName = 'User'
    regularUser.roles = [userRole]

    // Create test building
    testBuilding = new Building()
    testBuilding.name = 'Test Building'
    testBuilding.address = 'Test Address 123'
    testBuilding.floors = 5
    testBuilding.units = 20
  }

  describe('Apply Mode Tests with Admin User', () => {
    beforeEach(() => {
      // Mock JWT guard to return admin user
      mockJwtGuard.canActivate.mockImplementation((context) => {
        const request = context.switchToHttp().getRequest()
        request.user = adminUser
        return true
      })
    })

    it('should create a new ticket in apply mode', async () => {
      const assistantRequest = {
        messages: [],
        message: 'Crea un ticket para reparar la puerta principal del edificio',
        context: {
          userId: adminUser.id,
          tenantId: testBuilding.id,
          userRoles: ['ADMIN'],
        },
      }

      // Mock LLM response
      const mockLLMResponse = {
        message: 'Voy a crear un nuevo ticket para la reparación de la puerta principal.',
        toolCalls: [
          {
            function: {
              name: 'create',
              arguments: JSON.stringify({
                entity: 'Ticket',
                data: {
                  title: 'Reparar puerta principal',
                  description: 'La puerta principal del edificio necesita reparación',
                  priority: 'high',
                  status: 'open',
                  buildingId: testBuilding.id,
                  reportedById: adminUser.id,
                },
              }),
            },
          },
        ],
        timestamp: new Date().toISOString(),
        finished: true,
      }

      // Mock the LLM service call
      jest.spyOn(require('../services/llm.service'), 'LLMService').mockImplementation(() => ({
        chatCompletion: jest.fn().mockResolvedValue(mockLLMResponse),
        checkHealth: jest.fn().mockResolvedValue(true),
      }))

      const response = await request(app.getHttpServer())
        .post('/assistant')
        .send(assistantRequest)
        .expect(201)

      expect(response.body.message).toContain('ticket')
      expect(response.body.toolCalls).toBeDefined()
      expect(response.body.toolCalls.length).toBeGreaterThan(0)

      // Test tool execution in apply mode
      const toolExecution = {
        toolCall: {
          type: 'create',
          parameters: {
            entity: 'Ticket',
            data: {
              title: 'Reparar puerta principal',
              description: 'La puerta principal del edificio necesita reparación',
              priority: 'high',
              status: 'open',
              buildingId: testBuilding.id,
              reportedById: adminUser.id,
            },
          },
        },
        mode: 'apply',
      }

      const toolResponse = await request(app.getHttpServer())
        .post('/assistant/tool/execute')
        .set('x-idempotency-key', 'test-create-ticket-1')
        .send(toolExecution)
        .expect(201)

      expect(toolResponse.body.success).toBe(true)
      expect(toolResponse.body.mode).toBe('apply')
      expect(toolResponse.body.data).toBeDefined()
      expect(toolResponse.body.data.title).toBe('Reparar puerta principal')
    })

    it('should update ticket status in apply mode', async () => {
      // First create a ticket to update
      const createExecution = {
        toolCall: {
          type: 'create',
          parameters: {
            entity: 'Ticket',
            data: {
              title: 'Test Ticket for Update',
              description: 'This ticket will be updated',
              priority: 'medium',
              status: 'open',
              buildingId: testBuilding.id,
              reportedById: adminUser.id,
            },
          },
        },
        mode: 'apply',
      }

      const createResponse = await request(app.getHttpServer())
        .post('/assistant/tool/execute')
        .set('x-idempotency-key', 'test-create-for-update')
        .send(createExecution)
        .expect(201)

      const ticketId = createResponse.body.data.id

      // Now update the ticket
      const updateExecution = {
        toolCall: {
          type: 'update',
          parameters: {
            entity: 'Ticket',
            where: { id: ticketId },
            data: { status: 'in_progress', priority: 'high' },
          },
        },
        mode: 'apply',
      }

      const updateResponse = await request(app.getHttpServer())
        .post('/assistant/tool/execute')
        .set('x-idempotency-key', 'test-update-ticket-1')
        .send(updateExecution)
        .expect(201)

      expect(updateResponse.body.success).toBe(true)
      expect(updateResponse.body.mode).toBe('apply')
      expect(updateResponse.body.explain.affectedRecords).toBe(1)
    })

    it('should find tickets with complex filters', async () => {
      const findExecution = {
        toolCall: {
          type: 'find',
          parameters: {
            entity: 'Ticket',
            where: {
              status: 'open',
              priority: 'high',
              buildingId: testBuilding.id,
            },
            include: ['building', 'reportedBy'],
            limit: 10,
          },
        },
        mode: 'apply', // Even find operations can be in apply mode
      }

      const response = await request(app.getHttpServer())
        .post('/assistant/tool/execute')
        .set('x-idempotency-key', 'test-find-tickets-1')
        .send(findExecution)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeDefined()
      expect(Array.isArray(response.body.data)).toBe(true)
    })
  })

  describe('Apply Mode Tests with Regular User (Should Fail)', () => {
    beforeEach(() => {
      // Mock JWT guard to return regular user
      mockJwtGuard.canActivate.mockImplementation((context) => {
        const request = context.switchToHttp().getRequest()
        request.user = regularUser
        return true
      })
    })

    it('should reject apply mode for regular user', async () => {
      const toolExecution = {
        toolCall: {
          type: 'create',
          parameters: {
            entity: 'Ticket',
            data: {
              title: 'Unauthorized Ticket',
              description: 'This should fail',
              priority: 'low',
              status: 'open',
            },
          },
        },
        mode: 'apply',
      }

      await request(app.getHttpServer())
        .post('/assistant/tool/execute')
        .send(toolExecution)
        .expect(403) // Forbidden
    })

    it('should allow dry-run mode for regular user', async () => {
      const toolExecution = {
        toolCall: {
          type: 'find',
          parameters: {
            entity: 'Ticket',
            where: { status: 'open' },
          },
        },
        mode: 'dry-run',
      }

      const response = await request(app.getHttpServer())
        .post('/assistant/tool/execute')
        .send(toolExecution)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.mode).toBe('dry-run')
    })
  })

  describe('Idempotency Tests', () => {
    beforeEach(() => {
      mockJwtGuard.canActivate.mockImplementation((context) => {
        const request = context.switchToHttp().getRequest()
        request.user = adminUser
        return true
      })
    })

    it('should return same result for duplicate idempotency key', async () => {
      const toolExecution = {
        toolCall: {
          type: 'create',
          parameters: {
            entity: 'Ticket',
            data: {
              title: 'Idempotency Test Ticket',
              description: 'Testing idempotency',
              priority: 'low',
              status: 'open',
              buildingId: testBuilding.id,
              reportedById: adminUser.id,
            },
          },
        },
        mode: 'apply',
      }

      const idempotencyKey = 'test-idempotency-123'

      // First request
      const response1 = await request(app.getHttpServer())
        .post('/assistant/tool/execute')
        .set('x-idempotency-key', idempotencyKey)
        .send(toolExecution)
        .expect(201)

      // Second request with same key
      const response2 = await request(app.getHttpServer())
        .post('/assistant/tool/execute')
        .set('x-idempotency-key', idempotencyKey)
        .send(toolExecution)
        .expect(201)

      expect(response1.body.idempotencyKey).toBe(idempotencyKey)
      expect(response2.body.idempotencyKey).toBe(idempotencyKey)
      expect(response1.body.executedAt).toBe(response2.body.executedAt)
      expect(response1.body.data.id).toBe(response2.body.data.id)
    })
  })

  describe('Health Check', () => {
    it('should return assistant health status', async () => {
      const response = await request(app.getHttpServer())
        .get('/assistant/health')
        .expect(200)

      expect(response.body.status).toBeDefined()
      expect(response.body.llm).toBeDefined()
      expect(response.body.catalog).toBeDefined()
    })
  })

  describe('Entity Catalog', () => {
    it('should return entity catalog', async () => {
      const response = await request(app.getHttpServer())
        .get('/assistant/catalog')
        .expect(200)

      expect(response.body.entities).toBeDefined()
      expect(Array.isArray(response.body.entities)).toBe(true)
      expect(response.body.relationships).toBeDefined()
      expect(response.body.enums).toBeDefined()
      expect(response.body.generatedAt).toBeDefined()
    })
  })
})
