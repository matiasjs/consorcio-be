import { BaseEntity } from './base.entity';
import { User } from './user.entity';
export declare class TenantProfile extends BaseEntity {
    userId: string;
    notes?: string;
    documentType?: string;
    documentNumber?: string;
    birthDate?: Date;
    emergencyContact?: string;
    emergencyPhone?: string;
    leaseStartDate?: Date;
    leaseEndDate?: Date;
    monthlyRent?: number;
    currency: string;
    user: User;
}
