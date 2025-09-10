import { BaseEntity } from './base.entity';
import { Unit } from './unit.entity';
import { User } from './user.entity';
export declare class UnitOccupancy extends BaseEntity {
    unitId: string;
    ownerUserId?: string;
    tenantUserId?: string;
    startDate: Date;
    endDate?: Date;
    isPrimary: boolean;
    ownershipPercentage?: number;
    notes?: string;
    isActive: boolean;
    unit: Unit;
    ownerUser?: User;
    tenantUser?: User;
}
