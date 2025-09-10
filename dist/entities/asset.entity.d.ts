import { BaseEntity } from './base.entity';
import { Building } from './building.entity';
import { Vendor } from './vendor.entity';
import { MaintenancePlan } from './maintenance-plan.entity';
export declare enum AssetType {
    ELEVATOR = "ELEVATOR",
    HVAC = "HVAC",
    PLUMBING = "PLUMBING",
    ELECTRICAL = "ELECTRICAL",
    FIRE_SAFETY = "FIRE_SAFETY",
    SECURITY = "SECURITY",
    LIGHTING = "LIGHTING",
    GENERATOR = "GENERATOR",
    PUMP = "PUMP",
    BOILER = "BOILER",
    INTERCOM = "INTERCOM",
    ACCESS_CONTROL = "ACCESS_CONTROL",
    CCTV = "CCTV",
    ALARM = "ALARM",
    OTHER = "OTHER"
}
export declare enum AssetStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    UNDER_MAINTENANCE = "UNDER_MAINTENANCE",
    OUT_OF_ORDER = "OUT_OF_ORDER",
    RETIRED = "RETIRED"
}
export declare class Asset extends BaseEntity {
    buildingId: string;
    name: string;
    type: AssetType;
    serial?: string;
    installDate?: Date;
    vendorId?: string;
    notes?: string;
    manufacturer?: string;
    model?: string;
    location?: string;
    specifications?: string;
    purchasePrice?: number;
    currency: string;
    warrantyExpiry?: Date;
    warrantyProvider?: string;
    status: AssetStatus;
    expectedLifeYears?: number;
    lastMaintenanceDate?: Date;
    nextMaintenanceDate?: Date;
    documents?: Array<{
        filename: string;
        url: string;
        type: string;
        description?: string;
    }>;
    photos?: Array<{
        filename: string;
        url: string;
        description?: string;
        timestamp: Date;
    }>;
    maintenanceInstructions?: string;
    safetyNotes?: string;
    building: Building;
    preferredVendor?: Vendor;
    maintenancePlans: MaintenancePlan[];
}
