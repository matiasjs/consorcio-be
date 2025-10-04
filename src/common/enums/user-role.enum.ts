/**
 * @deprecated Use ROLES from '../auth/constants/roles-permissions' instead
 * This enum is kept for backward compatibility but should not be used in new code
 */
export enum UserRole {
  ADMIN = 'admin',
  SECRETARIA = 'secretaria',
  OWNER = 'owner',
  TENANT = 'tenant',
  PROVIDER = 'provider',

  // Legacy roles - deprecated
  SUPERADMIN = 'SUPERADMIN',
  ADMIN_OWNER = 'ADMIN_OWNER',
  STAFF = 'STAFF',
  INSPECTOR = 'INSPECTOR',
  PORTER = 'PORTER',
  CLEANING_STAFF = 'CLEANING_STAFF',
  VENDOR = 'VENDOR',
  READONLY = 'READONLY',
  MAINTENANCE = 'MAINTENANCE',
  ACCOUNTANT = 'ACCOUNTANT',
  SECREATRY = 'SECRETARY',
}
