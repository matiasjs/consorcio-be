import { UserRole } from '../enums';
export interface JwtPayload {
    sub: string;
    email: string;
    adminId: string;
    roles: UserRole[];
    iat?: number;
    exp?: number;
}
export interface JwtRefreshPayload {
    sub: string;
    adminId: string;
    iat?: number;
    exp?: number;
}
