import * as bcrypt from 'bcryptjs';
import { DataSource } from 'typeorm';
import { UserStatus } from '../../common/enums';
import {
  Administration,
  Building,
  Permission,
  Role,
  Unit,
  UnitOccupancy,
  User,
} from '../../entities';

export async function seedRBAC(dataSource: DataSource): Promise<void> {
  const permissionRepository = dataSource.getRepository(Permission);
  const roleRepository = dataSource.getRepository(Role);
  const userRepository = dataSource.getRepository(User);
  const administrationRepository = dataSource.getRepository(Administration);
  const buildingRepository = dataSource.getRepository(Building);
  const unitRepository = dataSource.getRepository(Unit);
  const unitOccupancyRepository = dataSource.getRepository(UnitOccupancy);

  console.log('🌱 Seeding RBAC data...');

  // 1. Create Permissions
  const permissions = [
    // Users
    { code: 'allUsers', description: 'Manage all users', module: 'users' },
    { code: 'readUsers', description: 'Read users', module: 'users' },

    // Buildings & Units
    {
      code: 'manageBuildings',
      description: 'Manage buildings',
      module: 'buildings',
    },
    { code: 'manageUnits', description: 'Manage units', module: 'units' },
    {
      code: 'managePeople',
      description: 'Manage people and occupancies',
      module: 'people',
    },

    // Billing
    {
      code: 'readBilling',
      description: 'Read billing information',
      module: 'billing',
    },
    { code: 'manageBilling', description: 'Manage billing', module: 'billing' },

    // Work Orders
    {
      code: 'createWorkOrder',
      description: 'Create work orders',
      module: 'workorders',
    },
    {
      code: 'updateWorkOrder',
      description: 'Update work orders',
      module: 'workorders',
    },
    {
      code: 'readWorkOrder',
      description: 'Read work orders',
      module: 'workorders',
    },
    {
      code: 'closeWorkOrder',
      description: 'Close work orders',
      module: 'workorders',
    },

    // Tickets
    {
      code: 'createTickets',
      description: 'Create tickets',
      module: 'tickets',
    },
    {
      code: 'readTickets',
      description: 'Read tickets',
      module: 'tickets',
    },
    {
      code: 'updateTickets',
      description: 'Update tickets',
      module: 'tickets',
    },
    {
      code: 'deleteTickets',
      description: 'Delete tickets',
      module: 'tickets',
    },

    // Vendors
    { code: 'manageVendors', description: 'Manage vendors', module: 'vendors' },

    // Documents
    {
      code: 'manageDocuments',
      description: 'Manage documents',
      module: 'documents',
    },

    // Notifications
    {
      code: 'manageNotifications',
      description: 'Manage notifications',
      module: 'notifications',
    },

    // Audit
    { code: 'readAuditLogs', description: 'Read audit logs', module: 'audit' },

    // RBAC Management
    { code: 'manageRoles', description: 'Manage roles', module: 'rbac' },
    { code: 'readRoles', description: 'Read roles', module: 'rbac' },
    {
      code: 'managePermissions',
      description: 'Manage permissions',
      module: 'rbac',
    },
    {
      code: 'readPermissions',
      description: 'Read permissions',
      module: 'rbac',
    },
  ];

  const createdPermissions: Permission[] = [];
  for (const permissionData of permissions) {
    let permission = await permissionRepository.findOne({
      where: { code: permissionData.code },
    });
    if (!permission) {
      permission = permissionRepository.create(permissionData);
      permission = await permissionRepository.save(permission);
    }
    createdPermissions.push(permission);
  }

  console.log(`✅ Created ${createdPermissions.length} permissions`);

  // 2. Create Administration for testing
  let administration = await administrationRepository.findOne({
    where: { name: 'Demo Administration' },
  });
  if (!administration) {
    administration = administrationRepository.create({
      name: 'Demo Administration',
      cuit: '20-12345678-9',
      email: 'demo@consorcios.com',
      phone: '+54 11 1234-5678',
      address: 'Av. Corrientes 1234, CABA',
      isActive: true,
    });
    administration = await administrationRepository.save(administration);
  }

  console.log(`✅ Created administration: ${administration.name}`);

  // 3. Create Roles with permissions
  const roleDefinitions = [
    {
      name: 'admin',
      description: 'Administrator with full access',
      permissionCodes: permissions.map((p) => p.code), // All permissions
    },
    {
      name: 'secretaria',
      description: 'Secretary with management permissions',
      permissionCodes: [
        'readUsers',
        'manageBuildings',
        'manageUnits',
        'managePeople',
        'readBilling',
        'manageBilling',
        'createWorkOrder',
        'updateWorkOrder',
        'readWorkOrder',
        'createTickets',
        'readTickets',
        'updateTickets',
        'deleteTickets',
        'manageVendors',
        'manageDocuments',
        'manageNotifications',
      ],
    },
    {
      name: 'owner',
      description: 'Property owner with limited access',
      permissionCodes: [
        'readBilling',
        'readWorkOrder',
        'createTickets',
        'readTickets',
      ],
    },
    {
      name: 'tenant',
      description: 'Tenant with basic access',
      permissionCodes: [
        'readBilling',
        'readWorkOrder',
        'createTickets',
        'readTickets',
      ],
    },
    {
      name: 'provider',
      description: 'Service provider',
      permissionCodes: ['readWorkOrder', 'updateWorkOrder', 'readTickets'],
    },
  ];

  const createdRoles: Role[] = [];
  for (const roleData of roleDefinitions) {
    let role = await roleRepository.findOne({
      where: { name: roleData.name, adminId: administration.id },
      relations: ['permissions'],
    });

    if (!role) {
      role = roleRepository.create({
        name: roleData.name,
        description: roleData.description,
        adminId: administration.id,
      });
      role = await roleRepository.save(role);
    }

    // Assign permissions to role
    const rolePermissions = createdPermissions.filter((p) =>
      roleData.permissionCodes.includes(p.code),
    );
    role.permissions = rolePermissions;
    role = await roleRepository.save(role);

    createdRoles.push(role);
  }

  console.log(`✅ Created ${createdRoles.length} roles`);

  // 4. Create Users
  const passwordHash = await bcrypt.hash('Admin123!', 12);

  const users = [
    {
      email: 'admin@demo.com',
      fullName: 'Administrator',
      passwordHash,
      roleName: 'admin',
    },
    {
      email: 'secretaria@demo.com',
      fullName: 'María Secretaria',
      passwordHash,
      roleName: 'secretaria',
    },
    {
      email: 'owner@demo.com',
      fullName: 'Juan Propietario',
      passwordHash,
      roleName: 'owner',
    },
    {
      email: 'tenant@demo.com',
      fullName: 'Ana Inquilina',
      passwordHash,
      roleName: 'tenant',
    },
    {
      email: 'provider@demo.com',
      fullName: 'Carlos Proveedor',
      passwordHash,
      roleName: 'provider',
    },
  ];

  const createdUsers: User[] = [];
  for (const userData of users) {
    let user = await userRepository.findOne({
      where: { email: userData.email, adminId: administration.id },
      relations: ['roles'],
    });

    if (!user) {
      user = userRepository.create({
        email: userData.email,
        fullName: userData.fullName,
        passwordHash: userData.passwordHash,
        adminId: administration.id,
        status: UserStatus.ACTIVE,
        emailVerifiedAt: new Date(),
      });
      user = await userRepository.save(user);
    }

    // Assign role to user
    const role = createdRoles.find((r) => r.name === userData.roleName);
    if (role) {
      user.roles = [role];
      user = await userRepository.save(user);
    }

    createdUsers.push(user);
  }

  console.log(`✅ Created ${createdUsers.length} users`);

  console.log('🎉 RBAC seeding completed successfully!');
}
