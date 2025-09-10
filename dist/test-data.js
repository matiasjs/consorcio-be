"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testTicket = exports.testVendor = exports.testUnit = exports.testBuilding = exports.testTenant = exports.testOwner = exports.testStaff = exports.testAdminOwner = exports.testSuperAdmin = exports.testAdministration = void 0;
const user_role_enum_1 = require("../src/common/enums/user-role.enum");
const user_status_enum_1 = require("../src/common/enums/user-status.enum");
const administration_entity_1 = require("../src/entities/administration.entity");
const ticket_entity_1 = require("../src/entities/ticket.entity");
const unit_entity_1 = require("../src/entities/unit.entity");
exports.testAdministration = {
    name: 'Test Administration',
    cuit: '20-12345678-9',
    email: 'admin@test.com',
    phone: '+54 11 1234-5678',
    address: 'Test Address 123',
    planTier: administration_entity_1.PlanTier.STANDARD,
    isActive: true,
};
exports.testSuperAdmin = {
    email: 'superadmin@test.com',
    phone: '+54 11 9876-5432',
    fullName: 'Super Admin User',
    roles: [user_role_enum_1.UserRole.SUPERADMIN],
    status: user_status_enum_1.UserStatus.ACTIVE,
};
exports.testAdminOwner = {
    email: 'admin@test.com',
    phone: '+54 11 1111-2222',
    fullName: 'Admin Owner User',
    roles: [user_role_enum_1.UserRole.ADMIN_OWNER],
    status: user_status_enum_1.UserStatus.ACTIVE,
};
exports.testStaff = {
    email: 'staff@test.com',
    phone: '+54 11 3333-4444',
    fullName: 'Staff User',
    roles: [user_role_enum_1.UserRole.STAFF],
    status: user_status_enum_1.UserStatus.ACTIVE,
};
exports.testOwner = {
    email: 'owner@test.com',
    phone: '+54 11 5555-6666',
    fullName: 'Owner User',
    roles: [user_role_enum_1.UserRole.OWNER],
    status: user_status_enum_1.UserStatus.ACTIVE,
};
exports.testTenant = {
    email: 'tenant@test.com',
    phone: '+54 11 7777-8888',
    fullName: 'Tenant User',
    roles: [user_role_enum_1.UserRole.TENANT],
    status: user_status_enum_1.UserStatus.ACTIVE,
};
exports.testBuilding = {
    name: 'Test Building',
    address: 'Test Building Address 456',
    city: 'Buenos Aires',
    country: 'Argentina',
};
exports.testUnit = {
    label: '1A',
    type: unit_entity_1.UnitType.APARTMENT,
    floor: 1,
    m2: 85.5,
    isRented: false,
};
exports.testVendor = {
    legalName: 'Test Vendor S.A.',
    trade: 'PLUMBING',
    email: 'vendor@test.com',
    phone: '+54 11 9999-0000',
    whatsapp: '+54 11 9999-0000',
    ratingAvg: 4.5,
};
exports.testTicket = {
    type: ticket_entity_1.TicketType.MAINTENANCE,
    title: 'Test Maintenance Ticket',
    description: 'This is a test maintenance ticket for testing purposes.',
    priority: ticket_entity_1.TicketPriority.MEDIUM,
    status: ticket_entity_1.TicketStatus.OPEN,
    estimatedCost: 1500.00,
    currency: 'ARS',
};
//# sourceMappingURL=test-data.js.map