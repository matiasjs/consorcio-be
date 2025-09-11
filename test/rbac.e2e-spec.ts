import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('RBAC System (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let secretariaToken: string;
  let ownerToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login with different users to get tokens
    const adminLogin = await request(app.getHttpServer())
      .post('/v1/auth/login')
      .send({
        email: 'admin@local',
        password: 'Admin123!',
      });
    adminToken = adminLogin.body.accessToken;

    const secretariaLogin = await request(app.getHttpServer())
      .post('/v1/auth/login')
      .send({
        email: 'secretaria@demo.com',
        password: 'Admin123!',
      });
    secretariaToken = secretariaLogin.body.accessToken;

    const ownerLogin = await request(app.getHttpServer())
      .post('/v1/auth/login')
      .send({
        email: 'owner@demo.com',
        password: 'Admin123!',
      });
    ownerToken = ownerLogin.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication', () => {
    it('should login admin and return JWT with permissions', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/auth/login')
        .send({
          email: 'admin@local',
          password: 'Admin123!',
        })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('roles');
      expect(response.body.user).toHaveProperty('permissions');
      expect(response.body.user.roles).toContain('admin');
      expect(response.body.user.permissions).toContain('allUsers');
    });

    it('should get user profile with roles and permissions', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/auth/me')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('roles');
      expect(response.body).toHaveProperty('permissions');
      expect(response.body.roles).toContain('admin');
      expect(response.body.permissions).toContain('allUsers');
    });
  });

  describe('Authorization', () => {
    it('should deny access without token', async () => {
      await request(app.getHttpServer())
        .get('/v1/users')
        .expect(401);
    });

    it('should deny access with insufficient permissions', async () => {
      await request(app.getHttpServer())
        .get('/v1/users')
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(403);
    });

    it('should allow access with sufficient permissions', async () => {
      await request(app.getHttpServer())
        .get('/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });
  });

  describe('Roles Management', () => {
    it('should create a new role', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/auth/roles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'test-role',
          description: 'Test role for e2e testing',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('test-role');
    });

    it('should list roles', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/auth/roles')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should deny role creation without permissions', async () => {
      await request(app.getHttpServer())
        .post('/v1/auth/roles')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          name: 'unauthorized-role',
          description: 'Should not be created',
        })
        .expect(403);
    });
  });

  describe('Permissions Management', () => {
    it('should list permissions', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/auth/permissions')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should create a new permission', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/auth/permissions')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          code: 'testPermission',
          description: 'Test permission for e2e testing',
          module: 'test',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.code).toBe('testPermission');
    });
  });

  describe('User Role Assignment', () => {
    let testUserId: string;

    beforeAll(async () => {
      // Create a test user first
      const userResponse = await request(app.getHttpServer())
        .post('/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          email: 'test-user@example.com',
          fullName: 'Test User',
          password: 'TestPassword123!',
        });
      testUserId = userResponse.body.id;
    });

    it('should assign roles to user', async () => {
      const response = await request(app.getHttpServer())
        .post(`/v1/auth/users/${testUserId}/roles`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          add: ['owner'],
        })
        .expect(200);

      expect(response.body).toHaveProperty('roles');
      expect(response.body.roles.some(role => role.name === 'owner')).toBe(true);
    });

    it('should get user with roles and permissions', async () => {
      const response = await request(app.getHttpServer())
        .get(`/v1/auth/users/${testUserId}/roles`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('roles');
      expect(response.body.roles.length).toBeGreaterThan(0);
    });
  });

  describe('Permission-based Access Control', () => {
    it('should allow secretaria to access buildings', async () => {
      await request(app.getHttpServer())
        .get('/v1/buildings')
        .set('Authorization', `Bearer ${secretariaToken}`)
        .expect(200);
    });

    it('should deny owner access to user management', async () => {
      await request(app.getHttpServer())
        .get('/v1/users')
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(403);
    });

    it('should allow owner to read billing (when implemented)', async () => {
      // This test would be for billing endpoints when they're protected
      // await request(app.getHttpServer())
      //   .get('/v1/billing')
      //   .set('Authorization', `Bearer ${ownerToken}`)
      //   .expect(200);
    });
  });
});
