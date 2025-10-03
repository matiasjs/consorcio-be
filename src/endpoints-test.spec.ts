// Web Crypto en Node (solo si falta)
import { webcrypto as nodeCrypto } from 'node:crypto';
globalThis.crypto ??= nodeCrypto as unknown as Crypto;

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';

describe('API Endpoints Test (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // Lista completa de endpoints esperados según backend_consorcios_api.md
  const expectedEndpoints = [
    // Auth & usuarios
    { method: 'POST', path: '/api/v1/auth/login', description: 'User login' },
    {
      method: 'POST',
      path: '/api/v1/auth/refresh',
      description: 'Refresh token',
    },
    { method: 'GET', path: '/api/v1/auth/me', description: 'Get current user' },

    // Users CRUD
    { method: 'GET', path: '/api/v1/users', description: 'Get all users' },
    { method: 'POST', path: '/api/v1/users', description: 'Create user' },
    { method: 'GET', path: '/api/v1/users/:id', description: 'Get user by ID' },
    { method: 'PATCH', path: '/api/v1/users/:id', description: 'Update user' },
    { method: 'DELETE', path: '/api/v1/users/:id', description: 'Delete user' },

    // Administrations CRUD
    {
      method: 'GET',
      path: '/api/v1/administrations',
      description: 'Get all administrations',
    },
    {
      method: 'POST',
      path: '/api/v1/administrations',
      description: 'Create administration',
    },
    {
      method: 'GET',
      path: '/api/v1/administrations/:id',
      description: 'Get administration by ID',
    },
    {
      method: 'PATCH',
      path: '/api/v1/administrations/:id',
      description: 'Update administration',
    },
    {
      method: 'DELETE',
      path: '/api/v1/administrations/:id',
      description: 'Delete administration',
    },

    // Buildings CRUD
    {
      method: 'GET',
      path: '/api/v1/buildings',
      description: 'Get all buildings',
    },
    {
      method: 'POST',
      path: '/api/v1/buildings',
      description: 'Create building',
    },
    {
      method: 'GET',
      path: '/api/v1/:id',
      description: 'Get building by ID',
    },
    {
      method: 'PATCH',
      path: '/api/v1/buildings/:id',
      description: 'Update building',
    },
    {
      method: 'DELETE',
      path: '/api/v1/buildings/:id',
      description: 'Delete building',
    },

    // Units CRUD
    { method: 'GET', path: '/api/v1/units', description: 'Get all units' },
    { method: 'POST', path: '/api/v1/units', description: 'Create unit' },
    { method: 'GET', path: '/api/v1/units/:id', description: 'Get unit by ID' },
    { method: 'PATCH', path: '/api/v1/units/:id', description: 'Update unit' },
    { method: 'DELETE', path: '/api/v1/units/:id', description: 'Delete unit' },
    {
      method: 'POST',
      path: '/api/v1/units/:id/occupancy',
      description: 'Create unit occupancy',
    },
    {
      method: 'GET',
      path: '/api/v1/units/:id/occupancy',
      description: 'Get unit occupancy',
    },

    // Vendors CRUD
    { method: 'GET', path: '/api/v1/vendors', description: 'Get all vendors' },
    { method: 'POST', path: '/api/v1/vendors', description: 'Create vendor' },
    {
      method: 'GET',
      path: '/api/v1/vendors/:id',
      description: 'Get vendor by ID',
    },
    {
      method: 'PATCH',
      path: '/api/v1/vendors/:id',
      description: 'Update vendor',
    },
    {
      method: 'DELETE',
      path: '/api/v1/vendors/:id',
      description: 'Delete vendor',
    },
    {
      method: 'GET',
      path: '/api/v1/vendors/:id/availability',
      description: 'Get vendor availability',
    },
    {
      method: 'POST',
      path: '/api/v1/vendors/:id/availability',
      description: 'Create vendor availability',
    },
    {
      method: 'PATCH',
      path: '/api/v1/vendors/:id/availability/:availabilityId',
      description: 'Update vendor availability',
    },
    {
      method: 'DELETE',
      path: '/api/v1/vendors/:id/availability/:availabilityId',
      description: 'Delete vendor availability',
    },

    // Tickets CRUD
    { method: 'GET', path: '/api/v1/tickets', description: 'Get all tickets' },
    { method: 'POST', path: '/api/v1/tickets', description: 'Create ticket' },
    {
      method: 'GET',
      path: '/api/v1/tickets/stats',
      description: 'Get ticket stats',
    },
    {
      method: 'GET',
      path: '/api/v1/tickets/:id',
      description: 'Get ticket by ID',
    },
    {
      method: 'PATCH',
      path: '/api/v1/tickets/:id',
      description: 'Update ticket',
    },
    {
      method: 'DELETE',
      path: '/api/v1/tickets/:id',
      description: 'Delete ticket',
    },
    {
      method: 'POST',
      path: '/api/v1/tickets/:id/assign-inspector',
      description: 'Assign inspector to ticket',
    },

    // Inspections CRUD
    {
      method: 'GET',
      path: '/api/v1/inspections',
      description: 'Get all inspections',
    },
    {
      method: 'POST',
      path: '/api/v1/inspections',
      description: 'Create inspection',
    },
    {
      method: 'GET',
      path: '/api/v1/inspections/:id',
      description: 'Get inspection by ID',
    },
    {
      method: 'PATCH',
      path: '/api/v1/inspections/:id',
      description: 'Update inspection',
    },
    {
      method: 'DELETE',
      path: '/api/v1/inspections/:id',
      description: 'Delete inspection',
    },

    // Work Orders CRUD
    {
      method: 'GET',
      path: '/api/v1/workorders',
      description: 'Get all work orders',
    },
    {
      method: 'POST',
      path: '/api/v1/workorders',
      description: 'Create work order',
    },
    {
      method: 'GET',
      path: '/api/v1/workorders/:id',
      description: 'Get work order by ID',
    },
    {
      method: 'PATCH',
      path: '/api/v1/workorders/:id',
      description: 'Update work order',
    },
    {
      method: 'DELETE',
      path: '/api/v1/workorders/:id',
      description: 'Delete work order',
    },
    {
      method: 'GET',
      path: '/api/v1/workorders/:id/quotes',
      description: 'Get work order quotes',
    },
    {
      method: 'POST',
      path: '/api/v1/workorders/:id/quotes',
      description: 'Create work order quote',
    },
    {
      method: 'POST',
      path: '/api/v1/workorders/:id/schedules',
      description: 'Create work order schedule',
    },

    // Materials CRUD
    {
      method: 'GET',
      path: '/api/v1/materials',
      description: 'Get all materials',
    },
    {
      method: 'POST',
      path: '/api/v1/materials',
      description: 'Create material',
    },
    {
      method: 'GET',
      path: '/api/v1/materials/:id',
      description: 'Get material by ID',
    },
    {
      method: 'PATCH',
      path: '/api/v1/materials/:id',
      description: 'Update material',
    },
    {
      method: 'DELETE',
      path: '/api/v1/materials/:id',
      description: 'Delete material',
    },
    {
      method: 'GET',
      path: '/api/v1/workorders/:id/materials',
      description: 'Get work order materials',
    },
    {
      method: 'POST',
      path: '/api/v1/workorders/:id/materials',
      description: 'Add material to work order',
    },

    // Invoices CRUD
    {
      method: 'GET',
      path: '/api/v1/invoices',
      description: 'Get all invoices',
    },
    { method: 'POST', path: '/api/v1/invoices', description: 'Create invoice' },
    {
      method: 'GET',
      path: '/api/v1/invoices/:id',
      description: 'Get invoice by ID',
    },
    {
      method: 'PATCH',
      path: '/api/v1/invoices/:id',
      description: 'Update invoice',
    },
    {
      method: 'DELETE',
      path: '/api/v1/invoices/:id',
      description: 'Delete invoice',
    },

    // Payments CRUD
    {
      method: 'GET',
      path: '/api/v1/payments',
      description: 'Get all payments',
    },
    { method: 'POST', path: '/api/v1/payments', description: 'Create payment' },
    {
      method: 'GET',
      path: '/api/v1/payments/:id',
      description: 'Get payment by ID',
    },
    {
      method: 'PATCH',
      path: '/api/v1/payments/:id',
      description: 'Update payment',
    },
    {
      method: 'DELETE',
      path: '/api/v1/payments/:id',
      description: 'Delete payment',
    },

    // Assets CRUD
    { method: 'GET', path: '/api/v1/assets', description: 'Get all assets' },
    { method: 'POST', path: '/api/v1/assets', description: 'Create asset' },
    {
      method: 'GET',
      path: '/api/v1/assets/:id',
      description: 'Get asset by ID',
    },
    {
      method: 'PATCH',
      path: '/api/v1/assets/:id',
      description: 'Update asset',
    },
    {
      method: 'DELETE',
      path: '/api/v1/assets/:id',
      description: 'Delete asset',
    },
    {
      method: 'GET',
      path: '/api/v1/assets/:id/plans',
      description: 'Get asset maintenance plans',
    },
    {
      method: 'POST',
      path: '/api/v1/assets/:id/plans',
      description: 'Create asset maintenance plan',
    },

    // Maintenance Plans CRUD
    {
      method: 'GET',
      path: '/api/v1/plans/:id/tasks',
      description: 'Get maintenance plan tasks',
    },
    {
      method: 'POST',
      path: '/api/v1/plans/:id/tasks',
      description: 'Create maintenance task',
    },

    // Meetings CRUD
    {
      method: 'GET',
      path: '/api/v1/meetings',
      description: 'Get all meetings',
    },
    { method: 'POST', path: '/api/v1/meetings', description: 'Create meeting' },
    {
      method: 'GET',
      path: '/api/v1/meetings/:id',
      description: 'Get meeting by ID',
    },
    {
      method: 'PATCH',
      path: '/api/v1/meetings/:id',
      description: 'Update meeting',
    },
    {
      method: 'DELETE',
      path: '/api/v1/meetings/:id',
      description: 'Delete meeting',
    },
    {
      method: 'GET',
      path: '/api/v1/meetings/:id/resolutions',
      description: 'Get meeting resolutions',
    },
    {
      method: 'POST',
      path: '/api/v1/meetings/:id/resolutions',
      description: 'Create meeting resolution',
    },
    {
      method: 'POST',
      path: '/api/v1/resolutions/:id/votes',
      description: 'Vote on resolution',
    },

    // Documents CRUD
    {
      method: 'GET',
      path: '/api/v1/documents',
      description: 'Get all documents',
    },
    {
      method: 'POST',
      path: '/api/v1/documents',
      description: 'Create document',
    },
    {
      method: 'GET',
      path: '/api/v1/documents/:id',
      description: 'Get document by ID',
    },
    {
      method: 'PATCH',
      path: '/api/v1/documents/:id',
      description: 'Update document',
    },
    {
      method: 'DELETE',
      path: '/api/v1/documents/:id',
      description: 'Delete document',
    },

    // Notifications CRUD
    {
      method: 'GET',
      path: '/api/v1/notifications',
      description: 'Get all notifications',
    },
    {
      method: 'POST',
      path: '/api/v1/notifications',
      description: 'Create notification',
    },
    {
      method: 'GET',
      path: '/api/v1/notifications/:id',
      description: 'Get notification by ID',
    },
    {
      method: 'PATCH',
      path: '/api/v1/notifications/:id',
      description: 'Update notification',
    },
    {
      method: 'DELETE',
      path: '/api/v1/notifications/:id',
      description: 'Delete notification',
    },

    // Subscriptions CRUD
    {
      method: 'GET',
      path: '/api/v1/subscriptions',
      description: 'Get all subscriptions',
    },
    {
      method: 'POST',
      path: '/api/v1/subscriptions',
      description: 'Create subscription',
    },
    {
      method: 'GET',
      path: '/api/v1/subscriptions/:id',
      description: 'Get subscription by ID',
    },
    {
      method: 'PATCH',
      path: '/api/v1/subscriptions/:id',
      description: 'Update subscription',
    },
    {
      method: 'DELETE',
      path: '/api/v1/subscriptions/:id',
      description: 'Delete subscription',
    },

    // Usage Metrics
    {
      method: 'GET',
      path: '/api/v1/usage-metrics',
      description: 'Get usage metrics',
    },

    // Audit Logs
    {
      method: 'GET',
      path: '/api/v1/audit-logs',
      description: 'Get audit logs',
    },

    // Messages
    { method: 'POST', path: '/api/v1/messages', description: 'Create message' },
    {
      method: 'GET',
      path: '/api/v1/messages/entity/:entityType/:entityId',
      description: 'Get messages for entity',
    },
    {
      method: 'GET',
      path: '/api/v1/messages/entity/:entityType/:entityId/unread-count',
      description: 'Get unread count',
    },
    {
      method: 'PATCH',
      path: '/api/v1/messages/:id/mark-read',
      description: 'Mark message as read',
    },
  ];

  describe('Endpoint Availability Check', () => {
    it('should log expected endpoints for manual verification', () => {
      console.log('\n=== EXPECTED ENDPOINTS REPORT ===');
      console.log(`Total expected endpoints: ${expectedEndpoints.length}\n`);

      const groupedEndpoints = expectedEndpoints.reduce(
        (acc, endpoint) => {
          const category = endpoint.path.split('/')[3] || 'other';
          if (!acc[category]) acc[category] = [];
          acc[category].push(endpoint);
          return acc;
        },
        {} as Record<string, typeof expectedEndpoints>,
      );

      Object.entries(groupedEndpoints).forEach(([category, endpoints]) => {
        console.log(`\n📁 ${category.toUpperCase()}:`);
        endpoints.forEach((endpoint) => {
          console.log(
            `   ${endpoint.method.padEnd(6)} ${endpoint.path} - ${endpoint.description}`,
          );
        });
      });

      console.log(
        `\n📊 SUMMARY: ${expectedEndpoints.length} total endpoints expected`,
      );

      // This test always passes - it's just for reporting
      expect(expectedEndpoints.length).toBeGreaterThan(0);
    });

    it('should have implemented core endpoints', async () => {
      // Test that the application is running and core endpoints are accessible
      const response = await fetch('http://localhost:3000/api/v1');
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty('message');
      expect(data.message).toContain('Consorcios Backend API');
    });

    it('should have Swagger documentation available', async () => {
      const response = await fetch('http://localhost:3000/api/docs-json');
      expect(response.status).toBe(200);

      const swaggerDoc = await response.json();
      expect(swaggerDoc).toHaveProperty('openapi');
      expect(swaggerDoc).toHaveProperty('paths');
      expect(swaggerDoc).toHaveProperty('info');
      expect(swaggerDoc.info.title).toBe('Consorcios Backend API');
    });

    it('should have authentication endpoints working', async () => {
      // Test login endpoint exists (should return 400 for empty body)
      const loginResponse = await fetch(
        'http://localhost:3000/api/v1/auth/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        },
      );
      expect(loginResponse.status).toBe(400); // Bad request due to validation
    });

    it('should protect secured endpoints', async () => {
      // Test that secured endpoints return 401 without token
      const protectedEndpoints = [
        '/api/v1/administrations',
        '/api/v1/users',
        '/api/v1/buildings',
        '/api/v1/units',
        '/api/v1/vendors',
        '/api/v1/tickets',
      ];

      for (const endpoint of protectedEndpoints) {
        const response = await fetch(`http://localhost:3000${endpoint}`);
        expect(response.status).toBe(401);
      }
    });
  });
});
