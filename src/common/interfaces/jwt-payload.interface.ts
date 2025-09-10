import { UserRole } from '../enums';

export interface JwtPayload {
  sub: string; // user id
  email: string;
  adminId: string;
  roles: UserRole[];
  iat?: number;
  exp?: number;
}

export interface JwtRefreshPayload {
  sub: string; // user id
  adminId: string;
  iat?: number;
  exp?: number;
}
