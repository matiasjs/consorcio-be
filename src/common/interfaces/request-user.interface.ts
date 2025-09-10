import type { UserRole } from '../enums';

export interface RequestUser {
  id: string;
  email: string;
  adminId: string;
  roles: UserRole[];
  fullName: string;
}
