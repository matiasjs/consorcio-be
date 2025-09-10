import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Building } from './building.entity';
import { Vendor } from './vendor.entity';
export declare enum PlanTier {
    BASIC = "BASIC",
    STANDARD = "STANDARD",
    PREMIUM = "PREMIUM",
    ENTERPRISE = "ENTERPRISE"
}
export declare class Administration extends BaseEntity {
    name: string;
    cuit: string;
    email: string;
    phone?: string;
    address?: string;
    planTier: PlanTier;
    isActive: boolean;
    users: User[];
    buildings: Building[];
    vendors: Vendor[];
}
