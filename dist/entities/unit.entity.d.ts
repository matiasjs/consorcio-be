import { BaseEntity } from './base.entity';
import { Building } from './building.entity';
import { UnitOccupancy } from './unit-occupancy.entity';
export declare enum UnitType {
    APARTMENT = "APARTMENT",
    STORE = "STORE",
    GARAGE = "GARAGE",
    STORAGE = "STORAGE",
    OFFICE = "OFFICE"
}
export declare class Unit extends BaseEntity {
    buildingId: string;
    label: string;
    type: UnitType;
    floor?: number;
    m2?: number;
    isRented: boolean;
    ownershipPercentage?: number;
    notes?: string;
    isActive: boolean;
    building: Building;
    occupancies: UnitOccupancy[];
}
