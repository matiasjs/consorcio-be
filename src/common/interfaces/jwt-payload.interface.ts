export interface JwtPayload {
  sub: string; // user id
  email: string;
  adminId: string;
  roles: string[];
  permissions: string[];
  iat?: number;
  exp?: number;
}

export interface JwtRefreshPayload {
  sub: string; // user id
  adminId: string;
  iat?: number;
  exp?: number;
}
