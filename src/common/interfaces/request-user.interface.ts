export interface RequestUser {
  id: string;
  email: string;
  adminId: string;
  roles: string[];
  permissions: string[];
  fullName: string;
}
