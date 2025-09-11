# RBAC Migration Guide

## Overview
This document outlines the migration from the old role-based system to the new RBAC (Role-Based Access Control) system with granular permissions.

## Changes Made

### 1. Database Schema Changes
- **Removed tables**: `owner_profiles`, `tenant_profiles`, `staff_profiles`
- **Added tables**: `roles`, `permissions`, `user_roles`, `role_permissions`
- **Modified `users` table**: 
  - Removed `roles` column (enum array)
  - Added profile fields directly: `notes`, `documentType`, `documentNumber`, `birthDate`, `emergencyContact`, `emergencyPhone`

### 2. New Entities
- `Role`: Represents user roles (admin, secretaria, owner, tenant, provider)
- `Permission`: Represents granular permissions (allUsers, manageBuildings, etc.)
- Many-to-many relationships through pivot tables

### 3. JWT Payload Changes
- Added `permissions: string[]` array with resolved permissions from user roles
- Changed `roles` from enum array to `string[]` with role names

### 4. New Decorators and Guards
- `@Permissions(...codes: string[])`: Decorator for permission-based access control
- `PermissionsGuard`: Guard that checks user permissions from JWT payload

## Migration Commands

### Destructive Reset (Recommended for Development)
```bash
# Drop and recreate database
npm run db:drop
npm run db:create
npm run db:migrate
npm run db:seed
```

### Manual Migration (Production)
```bash
# Run migration
npm run migration:run
npm run db:seed
```

## Permissions Matrix

### Core Permissions
- `allUsers` - Full user management
- `readUsers` - Read user information
- `manageBuildings` - CRUD operations on buildings
- `manageUnits` - CRUD operations on units
- `managePeople` - Manage occupancies and people
- `readBilling` - Read billing information
- `manageBilling` - Manage billing operations
- `createWorkOrder` - Create work orders/tickets
- `updateWorkOrder` - Update work orders/tickets
- `readWorkOrder` - Read work orders/tickets
- `closeWorkOrder` - Close work orders
- `manageVendors` - CRUD operations on vendors
- `manageDocuments` - CRUD operations on documents
- `manageNotifications` - CRUD operations on notifications
- `readAuditLogs` - Read audit logs
- `manageRoles` - CRUD operations on roles
- `readRoles` - Read roles
- `managePermissions` - CRUD operations on permissions
- `readPermissions` - Read permissions

### Role Definitions
- **admin**: All permissions
- **secretaria**: Management permissions (no user management)
- **owner**: Read billing and work orders (own scope)
- **tenant**: Read billing and work orders (own scope)
- **provider**: Read and update work orders (assigned scope)

## Controller Updates Required

### Pattern for Updating Controllers
1. **Update imports**:
```typescript
// OLD
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { User } from '../../entities/user.entity';

// NEW
import { CurrentUser, Permissions } from '../../common/decorators';
import { JwtAuthGuard, PermissionsGuard, TenantGuard } from '../../common/guards';
import type { RequestUser } from '../../common/interfaces';
```

2. **Update guards**:
```typescript
// OLD
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)

// NEW
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
```

3. **Update decorators**:
```typescript
// OLD
@Roles(UserRole.SUPERADMIN, UserRole.ADMIN_OWNER)

// NEW
@Permissions('manageBuildings')
```

4. **Update method parameters**:
```typescript
// OLD
@CurrentUser() currentUser: User

// NEW
@CurrentUser() currentUser: RequestUser
```

### Controllers to Update
- ✅ `src/modules/users/users.controller.ts`
- ✅ `src/modules/buildings/buildings.controller.ts`
- ⏳ `src/modules/units/units.controller.ts`
- ⏳ `src/modules/vendors/vendors.controller.ts`
- ⏳ `src/modules/tickets/tickets.controller.ts` (partially done)
- ⏳ `src/modules/workorders/workorders.controller.ts`
- ⏳ `src/modules/materials/materials.controller.ts`
- ⏳ `src/modules/invoices/invoices.controller.ts`
- ⏳ `src/modules/payments/payments.controller.ts`
- ⏳ `src/modules/documents/documents.controller.ts`
- ⏳ `src/modules/notifications/notifications.controller.ts`
- ⏳ `src/modules/audit-logs/audit-logs.controller.ts`

## Testing

### Seed Users
- **admin@local** / Admin123! (admin role)
- **secretaria@demo.com** / Admin123! (secretaria role)
- **owner@demo.com** / Admin123! (owner role)
- **tenant@demo.com** / Admin123! (tenant role)

### Test Scenarios
1. Login with different users
2. Test endpoint access with different permission levels
3. Verify 401 (no token) and 403 (insufficient permissions) responses
4. Test role and permission assignment endpoints

## New Endpoints

### Roles Management
- `GET /api/v1/auth/roles` - List roles
- `POST /api/v1/auth/roles` - Create role
- `GET /api/v1/auth/roles/:id` - Get role
- `PATCH /api/v1/auth/roles/:id` - Update role
- `DELETE /api/v1/auth/roles/:id` - Delete role
- `POST /api/v1/auth/roles/:id/permissions` - Assign permissions to role

### Permissions Management
- `GET /api/v1/auth/permissions` - List permissions
- `POST /api/v1/auth/permissions` - Create permission
- `GET /api/v1/auth/permissions/:id` - Get permission
- `PATCH /api/v1/auth/permissions/:id` - Update permission
- `DELETE /api/v1/auth/permissions/:id` - Delete permission

### User Role Assignment
- `POST /api/v1/auth/users/:id/roles` - Assign roles to user
- `GET /api/v1/auth/users/:id/roles` - Get user roles and permissions

## Notes
- Profile information is now stored directly in the `users` table
- Domain relationships (owner/tenant) are expressed through `unit_occupancy` table
- Staff relationships can be expressed through domain-specific tables as needed
- JWT tokens now include resolved permissions for efficient authorization
