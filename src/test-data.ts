import { UserRole } from '../src/common/enums/user-role.enum';
import { UserStatus } from '../src/common/enums/user-status.enum';
import { Administration, PlanTier } from '../src/entities/administration.entity';
import { Building } from '../src/entities/building.entity';
import { Ticket, TicketPriority, TicketStatus, TicketType } from '../src/entities/ticket.entity';
import { Unit, UnitType } from '../src/entities/unit.entity';
import { User } from '../src/entities/user.entity';
import { Vendor } from '../src/entities/vendor.entity';

export const testAdministration: Partial<Administration> = {
  name: 'Test Administration',
  cuit: '20-12345678-9',
  email: 'admin@test.com',
  phone: '+54 11 1234-5678',
  address: 'Test Address 123',
  planTier: PlanTier.STANDARD,
  isActive: true,
};

export const testSuperAdmin: Partial<User> = {
  email: 'superadmin@test.com',
  phone: '+54 11 9876-5432',
  fullName: 'Super Admin User',
  roles: [UserRole.SUPERADMIN],
  status: UserStatus.ACTIVE,
};

export const testAdminOwner: Partial<User> = {
  email: 'admin@test.com',
  phone: '+54 11 1111-2222',
  fullName: 'Admin Owner User',
  roles: [UserRole.ADMIN_OWNER],
  status: UserStatus.ACTIVE,
};

export const testStaff: Partial<User> = {
  email: 'staff@test.com',
  phone: '+54 11 3333-4444',
  fullName: 'Staff User',
  roles: [UserRole.STAFF],
  status: UserStatus.ACTIVE,
};

export const testOwner: Partial<User> = {
  email: 'owner@test.com',
  phone: '+54 11 5555-6666',
  fullName: 'Owner User',
  roles: [UserRole.OWNER],
  status: UserStatus.ACTIVE,
};

export const testTenant: Partial<User> = {
  email: 'tenant@test.com',
  phone: '+54 11 7777-8888',
  fullName: 'Tenant User',
  roles: [UserRole.TENANT],
  status: UserStatus.ACTIVE,
};

export const testBuilding: Partial<Building> = {
  name: 'Test Building',
  address: 'Test Building Address 456',
  city: 'Buenos Aires',
  country: 'Argentina',
};

export const testUnit: Partial<Unit> = {
  label: '1A',
  type: UnitType.APARTMENT,
  floor: 1,
  m2: 85.5,
  isRented: false,
};

export const testVendor: Partial<Vendor> = {
  legalName: 'Test Vendor S.A.',
  trade: 'PLUMBING',
  email: 'vendor@test.com',
  phone: '+54 11 9999-0000',
  whatsapp: '+54 11 9999-0000',
  ratingAvg: 4.5,
};

export const testTicket: Partial<Ticket> = {
  type: TicketType.MAINTENANCE,
  title: 'Test Maintenance Ticket',
  description: 'This is a test maintenance ticket for testing purposes.',
  priority: TicketPriority.MEDIUM,
  status: TicketStatus.OPEN,
  estimatedCost: 1500.00,
  currency: 'ARS',
};
