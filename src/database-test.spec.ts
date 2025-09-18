// Web Crypto en Node (solo si falta)
import { webcrypto as nodeCrypto } from 'node:crypto';
globalThis.crypto ??= nodeCrypto as unknown as Crypto;

import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';

import { getDatabaseConfig } from './config/database.config';
import { Administration } from './entities/administration.entity';
import { Building } from './entities/building.entity';
import {
  EntityType,
  Message,
  MessageChannel,
  MessageDirection,
} from './entities/message.entity';
import { Ticket } from './entities/ticket.entity';
import { Unit } from './entities/unit.entity';
import { User } from './entities/user.entity';
import { Vendor } from './entities/vendor.entity';
import {
  testAdministration,
  testAdminOwner,
  testBuilding,
  testOwner,
  testStaff,
  testSuperAdmin,
  testTenant,
  testTicket,
  testUnit,
  testVendor,
} from './test-data';

describe('Database Integration Tests', () => {
  let module: TestingModule;
  let adminRepo: Repository<Administration>;
  let userRepo: Repository<User>;
  let buildingRepo: Repository<Building>;
  let unitRepo: Repository<Unit>;
  let vendorRepo: Repository<Vendor>;
  let ticketRepo: Repository<Ticket>;
  let messageRepo: Repository<Message>;

  let savedAdmin: Administration;
  let savedSuperAdmin: User;
  let savedAdminOwner: User;
  let savedStaff: User;
  let savedOwner: User;
  let savedTenant: User;
  let savedBuilding: Building;
  let savedUnit: Unit;
  let savedVendor: Vendor;
  let savedTicket: Ticket;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: getDatabaseConfig,
          inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([
          Administration,
          User,
          Building,
          Unit,
          Vendor,
          Ticket,
          Message,
        ]),
      ],
    }).compile();

    adminRepo = module.get<Repository<Administration>>(
      'AdministrationRepository',
    );
    userRepo = module.get<Repository<User>>('UserRepository');
    buildingRepo = module.get<Repository<Building>>('BuildingRepository');
    unitRepo = module.get<Repository<Unit>>('UnitRepository');
    vendorRepo = module.get<Repository<Vendor>>('VendorRepository');
    ticketRepo = module.get<Repository<Ticket>>('TicketRepository');
    messageRepo = module.get<Repository<Message>>('MessageRepository');

    // Clean up existing data before tests
    try {
      await messageRepo.query(
        'TRUNCATE TABLE messages RESTART IDENTITY CASCADE',
      );
      await ticketRepo.query('TRUNCATE TABLE tickets RESTART IDENTITY CASCADE');
      await vendorRepo.query('TRUNCATE TABLE vendors RESTART IDENTITY CASCADE');
      await unitRepo.query('TRUNCATE TABLE units RESTART IDENTITY CASCADE');
      await buildingRepo.query(
        'TRUNCATE TABLE buildings RESTART IDENTITY CASCADE',
      );
      await userRepo.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
      await adminRepo.query(
        'TRUNCATE TABLE administrations RESTART IDENTITY CASCADE',
      );
    } catch (error) {
      console.log('Error cleaning up data:', error.message);
    }
  });

  afterAll(async () => {
    await module.close();
  });

  describe('Administration Entity', () => {
    it('should create an administration', async () => {
      const admin = adminRepo.create(testAdministration);
      savedAdmin = await adminRepo.save(admin);

      expect(savedAdmin).toBeDefined();
      expect(savedAdmin.id).toBeDefined();
      expect(savedAdmin.name).toBe(testAdministration.name);
      expect(savedAdmin.cuit).toBe(testAdministration.cuit);
      expect(savedAdmin.email).toBe(testAdministration.email);
      expect(savedAdmin.planTier).toBe(testAdministration.planTier);
      expect(savedAdmin.isActive).toBe(true);
    });

    it('should find the created administration', async () => {
      const found = await adminRepo.findOne({ where: { id: savedAdmin.id } });
      expect(found).toBeDefined();
      if (!found) throw new Error('Administration not found');
      expect(found.name).toBe(testAdministration.name);
    });
  });

  describe('User Entity', () => {
    it('should create a super admin user', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = userRepo.create({
        ...testSuperAdmin,
        adminId: savedAdmin.id,
        passwordHash: hashedPassword,
      });
      savedSuperAdmin = await userRepo.save(user);

      expect(savedSuperAdmin).toBeDefined();
      expect(savedSuperAdmin.id).toBeDefined();
      expect(savedSuperAdmin.email).toBe(testSuperAdmin.email);
      expect(savedSuperAdmin.roles).toContain('SUPERADMIN');
      expect(savedSuperAdmin.adminId).toBe(savedAdmin.id);
    });

    it('should create an admin owner user', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = userRepo.create({
        ...testAdminOwner,
        adminId: savedAdmin.id,
        passwordHash: hashedPassword,
      });
      savedAdminOwner = await userRepo.save(user);

      expect(savedAdminOwner).toBeDefined();
      expect(savedAdminOwner.roles).toContain('ADMIN_OWNER');
    });

    it('should create staff, owner, and tenant users', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);

      // Staff user
      const staff = userRepo.create({
        ...testStaff,
        adminId: savedAdmin.id,
        passwordHash: hashedPassword,
      });
      savedStaff = await userRepo.save(staff);

      // Owner user
      const owner = userRepo.create({
        ...testOwner,
        adminId: savedAdmin.id,
        passwordHash: hashedPassword,
      });
      savedOwner = await userRepo.save(owner);

      // Tenant user
      const tenant = userRepo.create({
        ...testTenant,
        adminId: savedAdmin.id,
        passwordHash: hashedPassword,
      });
      savedTenant = await userRepo.save(tenant);

      expect(savedStaff.roles).toContain('STAFF');
      expect(savedOwner.roles).toContain('OWNER');
      expect(savedTenant.roles).toContain('TENANT');
    });

    it('should find users by administration', async () => {
      const users = await userRepo.find({ where: { adminId: savedAdmin.id } });
      expect(users).toHaveLength(5); // superadmin, admin_owner, staff, owner, tenant
    });
  });

  describe('Building and Unit Entities', () => {
    it('should create a building', async () => {
      const building = buildingRepo.create({
        ...testBuilding,
        adminId: savedAdmin.id,
      });
      savedBuilding = await buildingRepo.save(building);

      expect(savedBuilding).toBeDefined();
      expect(savedBuilding.name).toBe(testBuilding.name);
      expect(savedBuilding.adminId).toBe(savedAdmin.id);
    });

    it('should create a unit', async () => {
      const unit = unitRepo.create({
        ...testUnit,
        buildingId: savedBuilding.id,
      });
      savedUnit = await unitRepo.save(unit);

      expect(savedUnit).toBeDefined();
      expect(savedUnit.label).toBe(testUnit.label);
      expect(savedUnit.buildingId).toBe(savedBuilding.id);
    });
  });

  describe('Vendor Entity', () => {
    it('should create a vendor', async () => {
      const vendor = vendorRepo.create({
        ...testVendor,
        adminId: savedAdmin.id,
      });
      savedVendor = await vendorRepo.save(vendor);

      expect(savedVendor).toBeDefined();
      expect(savedVendor.legalName).toBe(testVendor.legalName);
      expect(savedVendor.trade).toBe(testVendor.trade);
      expect(savedVendor.adminId).toBe(savedAdmin.id);
    });
  });

  describe('Ticket Entity', () => {
    it('should create a ticket', async () => {
      const ticket = ticketRepo.create({
        ...testTicket,
        adminId: savedAdmin.id,
        buildingId: savedBuilding.id,
        unitId: savedUnit.id,
        createdByUserId: savedOwner.id,
      });
      savedTicket = await ticketRepo.save(ticket);

      expect(savedTicket).toBeDefined();
      expect(savedTicket.title).toBe(testTicket.title);
      expect(savedTicket.adminId).toBe(savedAdmin.id);
      expect(savedTicket.buildingId).toBe(savedBuilding.id);
      expect(savedTicket.createdByUserId).toBe(savedOwner.id);
    });

    it('should find ticket with relations', async () => {
      const ticket = await ticketRepo.findOne({
        where: { id: savedTicket.id },
        relations: ['building', 'unit', 'createdByUser'],
      });

      expect(ticket).toBeDefined();
      if (!ticket) throw new Error('Ticket not found');
      expect(ticket.building).toBeDefined();
      expect(ticket.building.name).toBe(testBuilding.name);
      expect(ticket.unit).toBeDefined();
      if (!ticket.unit) throw new Error('Ticket unit is undefined');
      expect(ticket.unit.label).toBe(testUnit.label);
      expect(ticket.createdByUser).toBeDefined();
      expect(ticket.createdByUser.fullName).toBe(testOwner.fullName);
    });
  });

  describe('Message Entity', () => {
    it('should create a message for a ticket', async () => {
      const message = messageRepo.create({
        entityType: EntityType.TICKET,
        entityId: savedTicket.id,
        authorUserId: savedStaff.id,
        direction: MessageDirection.INTERNAL,
        channel: MessageChannel.WEB,
        body: 'This is a test message for the ticket.',
        subject: 'Test Message',
      });
      const savedMessage = await messageRepo.save(message);

      expect(savedMessage).toBeDefined();
      expect(savedMessage.entityType).toBe(EntityType.TICKET);
      expect(savedMessage.entityId).toBe(savedTicket.id);
      expect(savedMessage.authorUserId).toBe(savedStaff.id);
      expect(savedMessage.body).toBe('This is a test message for the ticket.');
    });

    it('should find messages for a ticket', async () => {
      const messages = await messageRepo.find({
        where: {
          entityType: EntityType.TICKET,
          entityId: savedTicket.id,
        },
        relations: ['author'],
      });

      expect(messages).toHaveLength(1);
      expect(messages[0].author).toBeDefined();
      if (!messages[0].author) throw new Error('Message author is undefined');
      expect(messages[0].author.fullName).toBe(testStaff.fullName);
    });
  });

  describe('Database Statistics', () => {
    it('should count all entities', async () => {
      const adminCount = await adminRepo.count();
      const userCount = await userRepo.count();
      const buildingCount = await buildingRepo.count();
      const unitCount = await unitRepo.count();
      const vendorCount = await vendorRepo.count();
      const ticketCount = await ticketRepo.count();
      const messageCount = await messageRepo.count();

      console.log('Database Statistics:');
      console.log(`- Administrations: ${adminCount}`);
      console.log(`- Users: ${userCount}`);
      console.log(`- Buildings: ${buildingCount}`);
      console.log(`- Units: ${unitCount}`);
      console.log(`- Vendors: ${vendorCount}`);
      console.log(`- Tickets: ${ticketCount}`);
      console.log(`- Messages: ${messageCount}`);

      expect(adminCount).toBeGreaterThan(0);
      expect(userCount).toBeGreaterThan(0);
      expect(buildingCount).toBeGreaterThan(0);
      expect(unitCount).toBeGreaterThan(0);
      expect(vendorCount).toBeGreaterThan(0);
      expect(ticketCount).toBeGreaterThan(0);
      expect(messageCount).toBeGreaterThan(0);
    });
  });
});
