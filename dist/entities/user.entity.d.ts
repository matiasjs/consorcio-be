import { BaseEntity } from './base.entity';
import { Administration } from './administration.entity';
import { UserRole, UserStatus } from '../common/enums';
import { OwnerProfile } from './owner-profile.entity';
import { TenantProfile } from './tenant-profile.entity';
import { StaffProfile } from './staff-profile.entity';
export declare class User extends BaseEntity {
    adminId: string;
    email: string;
    phone?: string;
    passwordHash: string;
    fullName: string;
    roles: UserRole[];
    status: UserStatus;
    lastLoginAt?: Date;
    lastLoginIp?: string;
    emailVerifiedAt?: Date;
    resetPasswordToken?: string;
    resetPasswordExpiresAt?: Date;
    administration: Administration;
    ownerProfile?: OwnerProfile;
    tenantProfile?: TenantProfile;
    staffProfile?: StaffProfile;
}
