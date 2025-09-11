// Script to update controllers with new permission system
// This is a reference for the manual updates needed

const controllerUpdates = {
  'src/modules/units/units.controller.ts': {
    permissions: {
      'POST': 'manageUnits',
      'GET': 'manageUnits', 
      'GET :id': 'manageUnits',
      'PATCH :id': 'manageUnits',
      'DELETE :id': 'manageUnits',
      'POST :id/occupancy': 'managePeople',
      'GET :id/occupancy': 'managePeople'
    }
  },
  'src/modules/vendors/vendors.controller.ts': {
    permissions: {
      'POST': 'manageVendors',
      'GET': 'manageVendors',
      'GET :id': 'manageVendors', 
      'PATCH :id': 'manageVendors',
      'DELETE :id': 'manageVendors',
      'POST :id/availability': 'manageVendors',
      'GET :id/availability': 'manageVendors'
    }
  },
  'src/modules/tickets/tickets.controller.ts': {
    permissions: {
      'POST': 'createWorkOrder',
      'GET': 'readWorkOrder',
      'GET :id': 'readWorkOrder',
      'PATCH :id': 'updateWorkOrder', 
      'DELETE :id': 'updateWorkOrder',
      'POST :id/assign-inspector': 'updateWorkOrder',
      'GET stats': 'readWorkOrder'
    }
  },
  'src/modules/workorders/workorders.controller.ts': {
    permissions: {
      'POST': 'createWorkOrder',
      'GET': 'readWorkOrder',
      'GET :id': 'readWorkOrder',
      'PATCH :id': 'updateWorkOrder',
      'DELETE :id': 'updateWorkOrder',
      'GET :id/quotes': 'readWorkOrder',
      'POST :id/quotes': 'updateWorkOrder',
      'POST :id/schedule': 'updateWorkOrder'
    }
  },
  'src/modules/materials/materials.controller.ts': {
    permissions: {
      'POST': 'manageBilling',
      'GET': 'readBilling',
      'GET :id': 'readBilling',
      'PATCH :id': 'manageBilling',
      'DELETE :id': 'manageBilling'
    }
  },
  'src/modules/invoices/invoices.controller.ts': {
    permissions: {
      'POST': 'manageBilling',
      'GET': 'readBilling',
      'GET :id': 'readBilling',
      'PATCH :id': 'manageBilling',
      'DELETE :id': 'manageBilling'
    }
  },
  'src/modules/payments/payments.controller.ts': {
    permissions: {
      'POST': 'manageBilling',
      'GET': 'readBilling',
      'GET :id': 'readBilling',
      'PATCH :id': 'manageBilling',
      'DELETE :id': 'manageBilling'
    }
  },
  'src/modules/documents/documents.controller.ts': {
    permissions: {
      'POST': 'manageDocuments',
      'GET': 'manageDocuments',
      'GET :id': 'manageDocuments',
      'PATCH :id': 'manageDocuments',
      'DELETE :id': 'manageDocuments'
    }
  },
  'src/modules/notifications/notifications.controller.ts': {
    permissions: {
      'POST': 'manageNotifications',
      'GET': 'manageNotifications',
      'GET :id': 'manageNotifications',
      'PATCH :id': 'manageNotifications',
      'DELETE :id': 'manageNotifications'
    }
  },
  'src/modules/audit-logs/audit-logs.controller.ts': {
    permissions: {
      'GET': 'readAuditLogs',
      'GET :id': 'readAuditLogs',
      'GET stats': 'readAuditLogs'
    }
  }
};

// Common replacements needed in all controllers:
const commonReplacements = {
  imports: {
    from: `import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { User } from '../../entities/user.entity';`,
    to: `import { CurrentUser, Permissions } from '../../common/decorators';
import { JwtAuthGuard, PermissionsGuard, TenantGuard } from '../../common/guards';
import type { RequestUser } from '../../common/interfaces';`
  },
  guards: {
    from: '@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)',
    to: '@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)'
  },
  userType: {
    from: '@CurrentUser() currentUser: User',
    to: '@CurrentUser() currentUser: RequestUser'
  }
};

console.log('Manual updates needed for controllers:');
console.log('1. Replace imports as shown in commonReplacements.imports');
console.log('2. Replace guards as shown in commonReplacements.guards');
console.log('3. Replace @Roles decorators with @Permissions using the mapping above');
console.log('4. Replace User type with RequestUser in method parameters');
