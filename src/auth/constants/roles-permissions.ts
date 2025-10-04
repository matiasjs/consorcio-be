/**
 * Roles y permisos extraídos de la base de datos
 * Generado automáticamente desde el seed
 */

/**
 * Roles disponibles en el sistema
 */
export const ROLES = {
  ADMIN: 'admin',
  SECRETARIA: 'secretaria',
  OWNER: 'owner',
  TENANT: 'tenant',
  PROVIDER: 'provider',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

/**
 * Permisos disponibles en el sistema
 * Organizados por módulo
 */
export const PERMISSIONS = {
  // Users module
  ALL_USERS: 'allUsers',
  READ_USERS: 'readUsers',

  // Buildings module
  MANAGE_BUILDINGS: 'manageBuildings',

  // Units module
  MANAGE_UNITS: 'manageUnits',

  // People module
  MANAGE_PEOPLE: 'managePeople',

  // Billing module
  READ_BILLING: 'readBilling',
  MANAGE_BILLING: 'manageBilling',

  // Work Orders module
  CREATE_WORK_ORDER: 'createWorkOrder',
  UPDATE_WORK_ORDER: 'updateWorkOrder',
  READ_WORK_ORDER: 'readWorkOrder',
  CLOSE_WORK_ORDER: 'closeWorkOrder',

  // Tickets module
  CREATE_TICKETS: 'createTickets',
  READ_TICKETS: 'readTickets',
  UPDATE_TICKETS: 'updateTickets',
  DELETE_TICKETS: 'deleteTickets',

  // Vendors module
  MANAGE_VENDORS: 'manageVendors',

  // Documents module
  MANAGE_DOCUMENTS: 'manageDocuments',

  // Notifications module
  MANAGE_NOTIFICATIONS: 'manageNotifications',

  // Audit module
  READ_AUDIT_LOGS: 'readAuditLogs',

  // RBAC module
  MANAGE_ROLES: 'manageRoles',
  READ_ROLES: 'readRoles',
  MANAGE_PERMISSIONS: 'managePermissions',
  READ_PERMISSIONS: 'readPermissions',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/**
 * Mapeo de roles a permisos según la base de datos
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.ADMIN]: [
    PERMISSIONS.ALL_USERS,
    PERMISSIONS.READ_USERS,
    PERMISSIONS.MANAGE_BUILDINGS,
    PERMISSIONS.MANAGE_UNITS,
    PERMISSIONS.MANAGE_PEOPLE,
    PERMISSIONS.READ_BILLING,
    PERMISSIONS.MANAGE_BILLING,
    PERMISSIONS.CREATE_WORK_ORDER,
    PERMISSIONS.UPDATE_WORK_ORDER,
    PERMISSIONS.READ_WORK_ORDER,
    PERMISSIONS.CLOSE_WORK_ORDER,
    PERMISSIONS.CREATE_TICKETS,
    PERMISSIONS.READ_TICKETS,
    PERMISSIONS.UPDATE_TICKETS,
    PERMISSIONS.DELETE_TICKETS,
    PERMISSIONS.MANAGE_VENDORS,
    PERMISSIONS.MANAGE_DOCUMENTS,
    PERMISSIONS.MANAGE_NOTIFICATIONS,
    PERMISSIONS.READ_AUDIT_LOGS,
    PERMISSIONS.MANAGE_ROLES,
    PERMISSIONS.READ_ROLES,
    PERMISSIONS.MANAGE_PERMISSIONS,
    PERMISSIONS.READ_PERMISSIONS,
  ],

  [ROLES.SECRETARIA]: [
    PERMISSIONS.READ_USERS,
    PERMISSIONS.MANAGE_BUILDINGS,
    PERMISSIONS.MANAGE_UNITS,
    PERMISSIONS.MANAGE_PEOPLE,
    PERMISSIONS.READ_BILLING,
    PERMISSIONS.MANAGE_BILLING,
    PERMISSIONS.CREATE_WORK_ORDER,
    PERMISSIONS.UPDATE_WORK_ORDER,
    PERMISSIONS.READ_WORK_ORDER,
    PERMISSIONS.CREATE_TICKETS,
    PERMISSIONS.READ_TICKETS,
    PERMISSIONS.UPDATE_TICKETS,
    PERMISSIONS.DELETE_TICKETS,
    PERMISSIONS.MANAGE_VENDORS,
    PERMISSIONS.MANAGE_DOCUMENTS,
    PERMISSIONS.MANAGE_NOTIFICATIONS,
  ],

  [ROLES.OWNER]: [
    PERMISSIONS.READ_BILLING,
    PERMISSIONS.READ_WORK_ORDER,
    PERMISSIONS.CREATE_TICKETS,
    PERMISSIONS.READ_TICKETS,
  ],

  [ROLES.TENANT]: [
    PERMISSIONS.CREATE_TICKETS,
    PERMISSIONS.READ_TICKETS,
    PERMISSIONS.READ_WORK_ORDER,
    PERMISSIONS.READ_BILLING,
  ],

  [ROLES.PROVIDER]: [
    PERMISSIONS.READ_TICKETS,
    PERMISSIONS.READ_WORK_ORDER,
    PERMISSIONS.UPDATE_WORK_ORDER,
  ],
};

/**
 * Lista de todos los roles disponibles
 */
export const ALL_ROLES = Object.values(ROLES);

/**
 * Lista de todos los permisos disponibles
 */
export const ALL_PERMISSIONS = Object.values(PERMISSIONS);

/**
 * Verifica si un rol tiene un permiso específico
 */
export function roleHasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Obtiene todos los permisos de un rol
 */
export function getRolePermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

/**
 * Obtiene todos los permisos de múltiples roles
 */
export function getMultipleRolesPermissions(roles: Role[]): Permission[] {
  const permissions = new Set<Permission>();
  roles.forEach((role) => {
    getRolePermissions(role).forEach((permission) => {
      permissions.add(permission);
    });
  });
  return Array.from(permissions);
}
